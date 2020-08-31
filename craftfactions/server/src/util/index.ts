import { TIME } from "./consts";

export const id = <T>(x: T) => x;

export const path = <T extends string, U extends {}>(segments: T[], obj: U) =>
	segments.reduce((o, key) => o && o[key], obj as any);

export const toBase64 = (s: string) => Buffer.from(s).toString("base64");

export const fromBase64 = (s: string) =>
	Buffer.from(s, "base64").toString("ascii");

export const memoise = <F extends (o: any) => unknown>(
	fun: F,
	ttl: number = TIME.MINUTE * 5,
): F => {
	const memo = {} as Record<string, ReturnType<F>>;

	function f(o: Parameters<F>[0]) {
		// think of something more rigorous later
		var index = JSON.stringify(o);

		if (index in memo) {
			return memo[index];
		} else {
			// delete cache after some time
			setTimeout(() => delete memo[index], ttl);

			return (memo[index] = fun(o) as ReturnType<F>);
		}
	}

	return f as F;
};
