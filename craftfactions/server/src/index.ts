import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

config();

import Member from "./database/Member";
import { authentication } from "./middleware/authentication";
import { createCrud } from "./util/crud";
import player from "./handlers/player";

const app = express();

type env = {
	DB_URI: string;
	PORT: string;
};

const env = process.env as env;

const port = env.PORT || "8060";

async function main() {
	app.use(cors());
	app.use(bodyParser.json());

	await mongoose.connect(env.DB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});

	const Crud = createCrud(app);

	app.get("/", (req, res) => {
		res.send("craftfactions server.");
	});

	app.use("/", player);

	Crud(Member, { authentication });

	app.listen(port, () => console.log("Listening on port", port));
}

main();
