export * from "./deferred.ts";

export { writeAll, copy } from "https://deno.land/std@0.123.0/streams/conversion.ts";

export const sleep = (t: number) => new Promise(r => setTimeout(r, t));

export const noop = () => void 0;

export const assert = (ok: boolean) => {
	if (!ok) {
		throw new Error("Assertion failed!");
	}
};

export const readAll = async (r: Deno.Reader, buf: Uint8Array) => {
	let bytesRead = 0;
	while (bytesRead < buf.byteLength) {
		const result = await r.read(buf.subarray(bytesRead));
		if (result === null) {
			if (bytesRead) return bytesRead;
			return null;
		}
		bytesRead += result;
	}
	return bytesRead;
};

export const close = (...conns: (Deno.Closer | undefined)[]) => {
	conns.forEach(conn => {
		try {
			conn?.close();
		} catch {}
	});
};

const catchAllIgnore = (promises: Promise<any>[]) => promises.forEach(promise => promise.catch(noop));

export const race = (promises: Promise<any>[]) =>
	Promise.race(promises)
		.then(() => catchAllIgnore(promises))
		.catch(e => (catchAllIgnore(promises), Promise.reject(e)));

/**
 * Close connection if no activity in 30 seconds
 */
export const timeout = (conn: Deno.Conn, ms: number = 45 * 1000): Deno.Conn => {
	let closed = false;

	function closer() {
		close(conn);
		closed = true;
	}

	let timer = setTimeout(closer, ms);

	return {
		localAddr: conn.localAddr,
		remoteAddr: conn.remoteAddr,
		rid: conn.rid,
		closeWrite: conn.closeWrite,
		async read(p) {
			if (closed) return null;

			clearTimeout(timer);
			timer = setTimeout(closer, ms);
			return conn.read(p);
		},
		async write(p) {
			clearTimeout(timer);
			timer = setTimeout(closer, ms);
			return conn.write(p);
		},
		close() {
			if (closed) return;

			clearTimeout(timer);
			closed = true;
			return conn.close();
		},
	};
};
