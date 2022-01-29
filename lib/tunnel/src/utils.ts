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

export const close = (...conns: Deno.Closer[]) => {
	conns.forEach(conn => {
		try {
			conn.close();
		} catch {}
	});
};
