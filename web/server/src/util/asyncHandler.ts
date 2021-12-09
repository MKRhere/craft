import { Handler, Request, Response, NextFunction } from "express";
import { path, id } from ".";

export const createError = <Opts extends number | {}>(
	message: string | Error,
	options?: Opts,
): Opts extends number
	? Error & { statusCode: Opts }
	: Opts extends {}
	? Error & Opts
	: Error => {
	const err = message instanceof Error ? message : new Error(message);
	if (typeof options === "number") {
		return Object.assign(err, { statusCode: options }) as any;
	} else if (options) {
		return Object.assign(err, options) as any;
	} else return err as any;
};

const asyncHandlerFactory = <CtxPath extends string[]>(ctxPath?: CtxPath) => {
	return (
		handlers: Handler | Handler[],
		errorMapper: <Err extends Error>(e: Err) => Err = id,
	) => {
		return async (req: Request, res: Response, next: NextFunction) => {
			if (ctxPath && ctxPath.length) {
				let context = path(ctxPath, req);
				if (typeof context !== "string") {
					try {
						context = JSON.stringify(context);
					} catch (e) {
						console.error(
							"WARNING: Could not stringify context, ignoring...",
							context,
						);
					}
				}
				const ctxname = ctxPath.reduce((a, b) => [a, b].join("."));
				if (context) {
					const originalMapper = errorMapper;
					errorMapper = error => {
						// @ts-ignore
						error.context = `{ ${ctxname}: ${context} }`;
						return originalMapper(error);
					};
				}
			}

			// binary combine two handlers
			const combine =
				(f: Handler, g: Handler): Handler =>
				(req, res, next) => {
					/*
					The first time combine is called,
					f will be def (default function defined below), which cannot throw
					From the second time, f will be a composition of previous (f . g)
					g is the only handler that can throw or reject when called
				*/
					return f(req, res, async (err: any) => {
						if (typeof err !== "undefined") {
							// connect-style logic; if next is called with an error, short circuit
							next(err);
						} else {
							try {
								await g(req, res, next);
							} catch (e: any) {
								next(errorMapper(e));
							}
						}
					});
				};

			// if no handlers were passed, ignore (req, res) and call next() by default
			const def = (_: any, __: any, next: NextFunction) => next();
			// variadic combine handlers by using binary combine
			const compose = (hs: Handler[]) => hs.reduce(combine, def);

			if (!Array.isArray(handlers)) {
				handlers = [handlers];
			}

			return compose(handlers)(req, res, next);
		};
	};
};

export const asyncHandler = Object.assign(asyncHandlerFactory(), {
	withCtx: asyncHandlerFactory,
});
