import type { Handler, Request } from "express";
import { TIME } from "../util/consts";

const store: { [k: string]: any } = {};

export const CacheStrategy = {
	path: (req: Request) => req.method + " " + req.path,
};

export const cache = (
	cacheResolver: (req: Request) => string = CacheStrategy.path,
	ttl: number = TIME.MINUTE * 5,
): Handler => (req, res, next) => {
	const cacheKey = cacheResolver(req);

	if (store[cacheKey]) {
		res.send(store[cacheKey]);
	} else {
		const oldSend = res.send.bind(res);
		res.send = <T>(val: T) => {
			if (res.statusCode === 200) {
				// store in cache
				store[cacheKey] = val;

				setTimeout(() => {
					// bust cache after ttl
					delete store[cacheKey];
				}, ttl);
			}
			return oldSend(val);
		};

		next();
	}
};
