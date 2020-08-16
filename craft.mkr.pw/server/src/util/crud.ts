import { Application, Router, Handler } from "express";
import { Model, Document } from "mongoose";

import { asyncHandler } from "./asyncHandler";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

const Acts = ["LIST", "CREATE", "GET", "UPDATE", "DELETE"] as const;
type Acts = typeof Acts;

type Opts = {
	validator?: Handler;
	authentication?: Handler;
	allow?: Acts[number][];
};

const defMiddleware: Handler = (_, __, next) => next();

export const createCrud = (app: Application) => <T extends Document>(
	model: Model<T>,
	{ validator = defMiddleware, authentication = defMiddleware, allow = Acts as Mutable<Acts> }: Opts = {},
) => {
	const router = Router();

	allow.includes("LIST") &&
		router.get(
			"/",
			asyncHandler(async (req, res) => res.json(await model.find())),
		);

	allow.includes("CREATE") &&
		router.post("/", asyncHandler([validator, async (req, res) => res.json(await model.create(req.body))]));

	allow.includes("GET") &&
		router.get(
			"/:id",
			asyncHandler(async (req, res) => res.json(await model.findById(req.params.id))),
		);

	allow.includes("UPDATE") &&
		router.put(
			"/:id",
			asyncHandler([
				validator,
				async (req, res) => res.json(await model.findByIdAndUpdate(req.params.id, { $set: req.body })),
			]),
		);

	allow.includes("DELETE") &&
		router.delete(
			"/:id",
			asyncHandler(async (req, res) => {
				await model.deleteOne({ _id: req.params.id as any });

				res.json({});
			}),
		);

	app.use(`/${model.modelName}`, authentication, router);
};
