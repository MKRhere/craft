import { spawn } from "child_process";
import { resolve } from "path";
import { createWriteStream, mkdirSync, promises as fs } from "fs";
import { createServer } from "net";
import { createInterface } from "readline";
import { EOL } from "os";

import { config as load } from "./loadConfig";

const { logs, proc, services } = load("config.json");

const masterCWD = process.cwd();

let serviceCount = 0;

for (const service of services) {
	const [cmd, ...args] = service.cmd.split(" ");
	const pwd = service.pwd ? resolve(masterCWD, service.pwd) : masterCWD;

	const logsDir = resolve(masterCWD, logs, service.name);
	const procDir = resolve(masterCWD, proc);

	const ip = "127.0.0.1";
	const port = "2000" + ++serviceCount;

	mkdirSync(logsDir, { recursive: true });
	mkdirSync(procDir, { recursive: true });

	console.log("[info] Spawning new service", service.name);

	fs.writeFile(
		resolve(procDir, service.name + ".json"),
		JSON.stringify(
			{
				name: service.name,
				ip,
				port,
			},
			null,
			"\t",
		),
	)
		.then(() =>
			console.log(
				"[info] written config for " + service.name + " to proc",
			),
		)
		.catch(e =>
			console.error(
				"[error] could not write config for " +
					service.name +
					" " +
					e.message,
			),
		);

	const spawned = spawn(cmd, args, { cwd: pwd, windowsHide: true });

	const getStdStream = () =>
		createWriteStream(resolve(logsDir, Date.now().toString() + ".txt"));

	const std = {
		stream: getStdStream(),
		count: 0,
	};

	const rl = (stream: NodeJS.ReadableStream) =>
		createInterface({ input: stream });

	createServer(client => {
		client.unref();

		client.on("error", e => console.error("[error]", e));

		const clientInput = rl(client);
		const clientWriter = (line: string) => client.write(line + EOL);

		const output = rl(spawned.stdout);
		const errors = rl(spawned.stderr);
		const spawnedWriter = (line: string) => spawned.stdin.write(line + EOL);

		clientInput.on("line", spawnedWriter);
		output.on("line", clientWriter);
		errors.on("line", clientWriter);

		client.on(
			"close",
			() => (
				output.removeListener("line", clientWriter),
				errors.removeListener("line", clientWriter)
			),
		);
	}).listen(Number(port), ip);

	spawned.stdout.on("data", chunk => {
		const lines = String(chunk).split("\n");

		if (std.count > 1000) {
			std.stream = getStdStream();

			std.count = 0;
		}

		std.count += lines.length;

		std.stream.write(lines.join("\n"));
	});

	spawned.stderr.on("data", chunk => {
		const lines = String(chunk).split("\n");

		if (std.count > 1000) {
			std.stream = getStdStream();

			std.count = 0;
		}

		std.count += lines.length;

		std.stream.write(lines.join("\n"));
	});
}
