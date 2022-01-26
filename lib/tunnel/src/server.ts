import { copy, readAll, writeAll } from "./utils.ts";

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
		for await (const conn of Deno.listen(opts)) {
			(async function handle() {
				const buf = new Uint8Array(10);
				await readAll(conn, buf);
				if (!auth(buf)) return conn.close();
				console.log("tunnel :: authenticated");

				const idx = getSpot("tunnel", conn);
				if (idx === null) return conn.close();

				console.log("tunnel :: spot reserved", idx);

				writeAll(conn, new TextEncoder().encode(String(idx).padEnd(4, " ")));
			})();
		}
	})(opts.tunnel);

	(async function proxy(opts: Deno.ListenOptions) {
		for await (const proxy of Deno.listen(opts)) {
			(async function handle() {
				const buf = new Uint8Array(10);
				await readAll(proxy, buf);
				if (!auth(buf)) return proxy.close();
				console.log("proxy :: authenticated");

				const idx = getSpot("proxy", proxy);
				if (idx === null) return proxy.close();

				console.log("proxy :: spot reserved", idx);

				const tunnel = tunnels[idx];
				if (!tunnel) {
					proxies[idx] = null;
					return proxy.close();
				}

				console.log("proxy :: tunnel discovered", idx);

				writeAll(proxy, new TextEncoder().encode(String(idx).padEnd(4, " ")));

				copy(tunnel, proxy).catch(() => {
					try {
						tunnel.close();
					} catch {}

					tunnels[idx] = null;
				});

				try {
					await copy(proxy, tunnel);
					console.log("proxy :: client disconnected", idx);
				} catch {
					console.log("proxy :: client errored, disconnecting");
				}

				tunnel.close();

				try {
					proxy.close();
				} catch {}

				console.log("proxy :: tunnel closed", idx);

				proxies[idx] = null;
				tunnels[idx] = null;
			})();
		}
	})(opts.proxy);
}

server({ maxConns: 20, proxy: { port: 25565 }, tunnel: { port: 15000 } });
