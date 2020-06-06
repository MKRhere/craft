import { readFileSync } from "fs";
import { resolve } from "path";

export type Service = {
	name: string;
	type?: "minecraft" | "ssh" | "any";
	cmd: string;
	pwd?: string;
};

export type Config = {
	logs: string;
	proc: string;
	services: Service[];
};

export type Proc = {
	name: string;
	ip: string;
	port: string;
};

const load = (filepath: string) => {
	try {
		return JSON.parse(
			readFileSync(resolve(process.cwd(), filepath), "utf-8"),
		);
	} catch {
		console.error("No config found or config malformed:", filepath);
		process.exit(100);
	}
};

export const config = (filepath: string) =>
	Object.assign(
		// defaults
		{ logs: "./.logs", proc: "./.proc", services: [] },
		load(filepath),
	) as Config;

export const proc = (filepath: string) => load(filepath) as Proc;
