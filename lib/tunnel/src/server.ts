import { copy, readAll, writeAll, close } from "./utils.ts";

type Opts = { tunnel: Deno.ListenOptions; proxy: Deno.ListenOptions; maxConns: number };

type Conns = (Deno.Conn | null)[];

function auth(buf: Uint8Array) {
	return new TextDecoder().decode(buf) === "password  ";
}

async function server(opts: Opts) {
	const tunnels: Conns = Array(opts.maxConns).fill(null);
	const proxies: Conns = Array(opts.maxConns).fill(null);

	const getSpot = (type: "proxy" | "tunnel", socket: Deno.Conn) => {
		const arr = type === "proxy" ? proxies : tunnels;
		const idx = arr.findIndex(item => item === null);

		if (idx === -1) return null;
		arr[idx] = socket;
		return idx;
	};

	(async function tunnel(opts: Deno.ListenOptions) {
		for await (const tunnel of Deno.listen(opts)) {
			(async function handle() {
				const buf = new Uint8Array(10);
				await readAll(tunnel, buf);
				if (!auth(buf)) return close(tunnel);
				console.log("tunnel :: authenticated");

				const idx = getSpot("tunnel", tunnel);
				if (idx === null) return close(tunnel);

				console.log("tunnel :: spot reserved", idx);

				writeAll(tunnel, new TextEncoder().encode(String(idx).padEnd(4, " ")));
			})();
		}
	})(opts.tunnel);

	(async function proxy(opts: Deno.ListenOptions) {
		for await (const proxy of Deno.listen(opts)) {
			(async function handle() {
				const buf = new Uint8Array(10);
				await readAll(proxy, buf);
				if (!auth(buf)) return close(proxy);
				console.log("proxy :: authenticated");

				const idx = getSpot("proxy", proxy);
				if (idx === null) return close(proxy);

				console.log("proxy :: spot reserved", idx);

				const tunnel = tunnels[idx];
				if (!tunnel) {
					proxies[idx] = null;
					return close(proxy);
				}

				console.log("proxy :: tunnel discovered", idx);

				writeAll(proxy, new TextEncoder().encode(String(idx).padEnd(4, " ")));

				copy(tunnel, proxy).catch(() => {
					close(tunnel, proxy);

					tunnels[idx] = null;
				});

				try {
					await copy(proxy, tunnel);
					console.log("proxy :: client disconnected", idx);
				} catch {
					console.log("proxy :: client errored, disconnecting");
				}

				close(tunnel, proxy);

				console.log("proxy :: tunnel closed", idx);

				proxies[idx] = null;
				tunnels[idx] = null;
			})();
		}
	})(opts.proxy);
}

server({ maxConns: 20, proxy: { port: 25565 }, tunnel: { port: 15000 } });