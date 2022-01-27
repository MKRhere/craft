import { copy, readAll, writeAll, ends, close } from "./utils.ts";

type Opts = { tunnel: Deno.ListenOptions; proxy: Deno.ListenOptions; maxConns: number };

type Conns = (Deno.Conn | null)[];

function auth(buf: Uint8Array) {
	return new TextDecoder().decode(buf) === "password  ";
}

async function server(opts: Opts) {
	const tunnels: Conns = Array(opts.maxConns).fill(null);
	const proxies: Conns = Array(opts.maxConns).fill(null);

	const reserveSlot = (type: "proxy" | "tunnel", socket: Deno.Conn) => {
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

				const idx = reserveSlot("tunnel", tunnel);
				if (idx === null) return close(tunnel);

				console.log("tunnel :: slot reserved", idx);

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

				const idx = reserveSlot("proxy", proxy);
				if (idx === null) return close(proxy);

				console.log("proxy :: slot reserved", idx);

				const tunnel = tunnels[idx];
				if (!tunnel) {
					proxies[idx] = null;
					return close(proxy);
				}

				console.log("proxy :: tunnel discovered", idx);

				writeAll(proxy, new TextEncoder().encode(String(idx).padEnd(4, " ")));

				try {
					await Promise.race([copy(tunnel, proxy), copy(proxy, tunnel)]);
					console.log("proxy :: disconnected", idx);
				} catch (e) {
					console.error(e);
					console.log("proxy :: errored, disconnecting");
				} finally {
					close(tunnel, proxy);
				}

				console.log("proxy :: tunnel closed", idx);

				proxies[idx] = null;
				tunnels[idx] = null;
			})();
		}
	})(opts.proxy);
}

server({ maxConns: 20, proxy: { port: 25565 }, tunnel: { port: 15000 } });
