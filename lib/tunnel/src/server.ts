import { Deferred, deferred, noop, copy, readAll, writeAll, race, close, timeout } from "./utils.ts";

type Opts = {
	tunnel: Deno.ListenOptions & { pwd: string };
	proxy: Deno.ListenOptions & { pwd: string };
	maxConns: number;
};

type Tunnel = (Deno.Conn & { init: Deferred<Uint8Array> }) | null;
type Proxy = Deno.Conn | null;

function auth(buf: Uint8Array, pwd: string) {
	return new TextDecoder().decode(buf) === pwd.padEnd(10);
}

export async function server(opts: Opts) {
	await Deno.permissions.request({ name: "net" });

	const tunnels: Tunnel[] = Array(opts.maxConns).fill(null);
	const proxies: Proxy[] = Array(opts.maxConns).fill(null);

	const reserveSlot = (type: "proxy" | "tunnel", socket: Deno.Conn) => {
		const arr = type === "proxy" ? proxies : tunnels;
		const idx = arr.findIndex(item => item === null);

		if (idx === -1) return null;
		arr[idx] = socket;
		return idx;
	};

	(async function tunnel(opts: Opts["tunnel"]) {
		console.log("tunnel :: starting server:", opts);

		for await (const conn of Deno.listen(opts)) {
			(async function handle() {
				const tunnel: Tunnel = Object.assign(timeout(conn), { init: deferred<Uint8Array>() });

				const buf = new Uint8Array(10);

				try {
					await readAll(tunnel, buf);
				} catch {
					// close and return, let client restart connection
					return close(tunnel);
				}

				if (!auth(buf, opts.pwd)) return close(tunnel);
				console.log("tunnel :: authenticated");

				const idx = reserveSlot("tunnel", tunnel);
				if (idx === null) return close(tunnel);

				console.log("tunnel :: slot reserved", idx);

				try {
					await writeAll(tunnel, new TextEncoder().encode(String(idx).padEnd(4, " ")));
				} catch {
					// close and return, let client restart connection
					return close(tunnel);
				}

				const hang = new Uint8Array(1);

				const reject = (e: Error) => {
					if (proxies[idx]) {
						// reject here and let proxy handler handle this error
						tunnel.init.reject(e);
					}

					console.log("tunnel :: errored, disconnecting", idx);
					close(tunnel);
					tunnels[idx] = null;
				};

				try {
					const result = await readAll(tunnel, hang);
					if (result === null) reject(new Error("Connection closed while waiting for init byte"));
					else tunnel.init.resolve(hang);
				} catch (e) {
					reject(e);
				}
			})();
		}
	})(opts.tunnel);

	(async function proxy(opts: Opts["proxy"]) {
		console.log("proxy :: starting server:", opts);

		for await (const conn of Deno.listen(opts)) {
			(async function handle() {
				const proxy = timeout(conn);

				const buf = new Uint8Array(10);

				try {
					await readAll(proxy, buf);
				} catch {
					// close and return, let client restart connection
					return close(proxy);
				}

				if (!auth(buf, opts.pwd)) return close(proxy);
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

				let c1: Promise<number> = Promise.resolve(0);

				try {
					await writeAll(proxy, new TextEncoder().encode(String(idx).padEnd(4, " ")));

					c1 = copy(proxy, tunnel);

					const init = await tunnel.init;
					await writeAll(proxy, init);
					const c2 = copy(tunnel, proxy);

					await race([c1, c2]);
					console.log("proxy :: disconnected", idx);
				} catch (e) {
					c1.catch(() => noop);
					console.error(e);
					console.log("proxy :: errored, disconnecting");
				} finally {
					close(tunnel, proxy);

					console.log("proxy :: tunnel closed", idx);

					proxies[idx] = null;
					tunnels[idx] = null;
				}
			})();
		}
	})(opts.proxy);

	setInterval(() => {
		console.log("                 ------ healthcheck ------");
		console.log("tunnels ::", tunnels.map(tunnel => (tunnel ? "O" : "C")).join(" "));
		console.log("proxies ::", proxies.map(proxies => (proxies ? "O" : "C")).join(" "));
		console.log("                 -------------------------");
	}, 5000);
}
