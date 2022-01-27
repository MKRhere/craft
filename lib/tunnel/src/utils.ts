type AnyF = (...args: any[]) => void;

export * from "./deferred.ts";

export const sleep = (t: number) => new Promise(r => setTimeout(r, t));

export const noop = () => void 0;

export const tryElse = <F extends AnyF, E extends AnyF>(f: F, c: E) => {
	try {
		f();
	} catch {
		c();
	}
};

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

export const writeAll = async (w: Deno.Writer, buf: Uint8Array) => {
	let bytesWritten = 0;
	while (bytesWritten < buf.byteLength) {
		bytesWritten += await w.write(buf.subarray(bytesWritten));
	}
	return bytesWritten;
};

export const copy = async (r: Deno.Reader, w: Deno.Writer) => {
	const buf = new Uint8Array(65535);
	while (true) {
		const result = await r.read(buf);
		if (result === null) {
			return null;
		}
		await w.write(buf.subarray(0, result));
	}
};

export const ends = async (r: Deno.Reader) => {
	let buf = new Uint8Array(65535);
	while ((await r.read(buf)) !== null) {}
	return true;
};

export const close = (...conns: Deno.Closer[]) => {
	conns.forEach(conn => {
		try {
			conn.close();
		} catch {}
	});
};
