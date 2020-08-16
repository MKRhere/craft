import { config } from "dotenv";
import express, { Handler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

config();

import Member from "./database/Member";
import { createCrud } from "./util/crud";
import { asyncHandler, createError } from "./util/asyncHandler";
import { getStats } from "./util/minecraft";

const app = express();

type env = {
	DB_URI: string;
	PORT: string;
};

const env = process.env as env;

const port = env.PORT || "8060";

// Todo: Telegram auth?
const authentication: Handler = (_, __, next) => next();

async function main() {
	app.use(cors());
	app.use(bodyParser.json());

	await mongoose.connect(env.DB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});

	app.get("/", (req, res) => {
		res.send("craftfactions server.");
	});

	app.get(
		"/player/:id/stats",
		asyncHandler([
			authentication,
			async (req, res) => {
				const member = await Member.findById(req.params.id);

				if (!member || member.type !== "PLAYER") throw createError("Player not found", 404);

				res.json(await getStats(member.memberName));
			},
		]),
	);

	app.get(
		"/player",
		asyncHandler([authentication, async (req, res) => res.json(await Member.find({ type: { $ne: "FACTION" } }))]),
	);

	app.get(
		"/faction",
		asyncHandler([authentication, async (req, res) => res.json(await Member.find({ type: { $ne: "PLAYER" } }))]),
	);

	const Crud = createCrud(app);

	Crud(Member, { authentication });

	app.listen(port, () => console.log("Listening on port", port));
}

main();
