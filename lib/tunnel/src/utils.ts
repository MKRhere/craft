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
