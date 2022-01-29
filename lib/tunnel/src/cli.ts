import { sleep } from "./utils.ts";
import { proxyClient, tunnelClient } from "./client.ts";
import { server } from "./server.ts";

const help = `
Usage:

  mkrt proxy --pwd <password> --server craft.mkr.pw:25010 --port 25565
  mkrt tunnel --pwd <password> --server craft.mkr.pw:25252 --port 25565
  mkrt server --proxy 25010 --proxy-pwd <password> --tunnel 25252 --tunnel-pwd <password> --max-conn 20
`.trim();

const chunk = <T>(arr: T[], size: number) =>
	Array(Math.ceil(arr.length / size))
		.fill(null)
		.map((_, i) => arr.slice(i * size, i * size + size));

const errWithHelp = (...str: string[]) => {
	console.log(...str, "\n");
	console.log(help, "\n");
};

type ClientArgs = {
	"--pwd": string;
	"--server": [string, number];
	"--port": number;
};

type ServerArgs = {
	"--proxy": number;
	"--proxy-pwd": string;
	"--tunnel": number;
	"--tunnel-pwd": string;
	"--max-conn"?: number;
};

type CommandArgs = {
	proxy: ClientArgs;
	tunnel: ClientArgs;
	server: ServerArgs;
};

function getPort(port: string) {
	const p = Number.parseInt(port);
	if (p < 1024 || p > 65535) throw new TypeError("port is not valid. Received: " + port);
	return p;
}

function getServer(server: string) {
	const [host, port] = server.split(":");
	if (!host || !port) throw new TypeError("server must be of the format `host:port`. Received: " + server);
	return [host, getPort(port)] as const;
}

function getInt(input: string) {
	const int = Number.parseInt(input);
	if (!int) throw new TypeError(input + " is not a valid number.");
	return int;
}

function argMapper(k: keyof ClientArgs | keyof ServerArgs, v: string) {
	if (k === "--server") return [k, getServer(v)] as const;
	if (k === "--port") return [k, getPort(v)] as const;
	if (k === "--max-conn") return [k, getInt(v)] as const;
	if (k === "--proxy") return [k, getPort(v)] as const;
	if (k === "--tunnel") return [k, getPort(v)] as const;
	else return [k, v] as const;
}

type Parsed = { [k in keyof CommandArgs]: { cmd: k } & CommandArgs[k] }[keyof CommandArgs];

function parseArgs<T extends keyof CommandArgs>(cmd: T, args: string[]): Parsed | void {
	if (!args.length || args.length % 2) return errWithHelp("Malformed arguments.");
	return Object.assign(
		{ cmd },
		Object.fromEntries(chunk(args, 2).map(([k, v]) => argMapper(k as keyof CommandArgs[keyof CommandArgs], v))),
	);
}

function includes<T extends readonly string[] | string[]>(str: string, match: T): str is T[number] {
	return match.includes(str);
}

const commands = ["proxy", "tunnel", "server"] as const;

async function main(): Promise<void> {
	if (!Deno.args.length) return console.log(help);

	const command = Deno.args[0];

	if (!includes(command, commands)) return errWithHelp("Command should be one of 'proxy' or 'tunnel'.");

	const args = parseArgs(command, Deno.args.slice(1));

	if (!args) return;

	if (args.cmd === "server") {
		await server({
			maxConns: args["--max-conn"] || 20,
			proxy: { port: args["--proxy"], pwd: args["--proxy-pwd"] },
			tunnel: { port: args["--tunnel"], pwd: args["--tunnel-pwd"] },
		});
	}

	if (args.cmd === "proxy") {
		try {
			return await proxyClient({
				server: { port: args["--server"][1], hostname: args["--server"][0], pwd: args["--pwd"] },
				minecraft: { port: args["--port"] },
			});
		} catch (e) {
			console.error(e);
			console.log("proxy closed, restarting...");
			await sleep(500);
			return main();
		}
	}

	if (args.cmd === "tunnel") {
		Array(20)
			.fill(null)
			.forEach(async (_, i) => {
				await sleep(500 * i * i);

				tunnelClient({
					server: { port: args["--server"][1], hostname: args["--server"][0], pwd: args["--pwd"] },
					minecraft: { port: args["--port"] },
				});
			});
	}
}

main();
