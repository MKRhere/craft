import { connect } from "net";
import { createInterface } from "readline";
import { resolve } from "path";
import { EOL } from "os";

import { config as load, proc as loadProc, Proc } from "./util/loadConfig";

export default function main() {
	const { proc: procPath, services } = load("config.json");

	const name = process.argv[3]; // Usage: tool client <app-name>
	const app = services.find(each => each.name === name);

	if (app) {
		const masterCWD = process.cwd();

		const procDir = resolve(masterCWD, procPath);

		const proc = loadProc(resolve(procDir, app.name + ".json"));

		const client = connect(Number(proc.port), proc.ip);
		client.unref();

		const clientrl = createInterface({ input: client });
		const rl = createInterface({ input: process.stdin });

		client.on("close", () => {
			console.log("[info] Connection to", proc.name, "lost, exiting...");

			clientrl.close();
			rl.close();
		});

		rl.on("line", line => client.write(line + EOL));
		clientrl.on("line", line => console.log(line));
	} else {
		console.error("[error] Process not found: " + name);
	}
}
