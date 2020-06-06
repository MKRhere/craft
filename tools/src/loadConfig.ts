import { readFileSync } from "fs";
import { join } from "path";

type Service = {
	name: string;
	type?: "minecraft" | "ssh" | "any";
	cmd: string;
	pwd?: string;
};

type Config = {
	logs: string;
	proc: string;
	services: Service[];
};

export default (filename: string) => {
	try {
		return Object.assign(
			// defaults
			{ logs: "./.logs", proc: "./.proc", services: [] },
			// override
			JSON.parse(readFileSync(join(process.cwd(), filename), "utf-8")),
		) as Config;
	} catch {
		console.error(
			"No config found or config malformed, create a config.json start launcher.",
		);
		process.exit(100);
	}
};
