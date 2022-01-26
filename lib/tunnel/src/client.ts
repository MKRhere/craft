import { copy, readAll } from "./utils.ts";

type Opts = { server: Deno.ConnectOptions; minecraft: Deno.ConnectOptions };

async function tunnelClient(opts: Opts) {
	const conn = await Deno.connect(opts.server);

	conn.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	await readAll(conn, buf);
	console.log(new TextDecoder().decode(buf));

	const mc = await Deno.connect(opts.minecraft);
	console.log("tunnel :: connected to Minecraft");

	await Promise.race([copy(mc, conn), copy(conn, mc)]);

	console.log("tunnel :: connection closed");

	conn.close();
	mc.close();

	tunnelClient(opts);
}

async function proxyClient(opts: Opts) {
	const conn = await Deno.connect(opts.server);

	conn.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	await readAll(conn, buf);

	for await (const mc of Deno.listen(opts.minecraft)) {
		console.log("proxy :: connected from Minecraft");

		copy(conn, mc);
		await copy(mc, conn);
		console.log("proxy :: Minecraft disconnected");
	}
}

tunnelClient({ server: { port: 15000 }, minecraft: { port: 25888 } });
proxyClient({ server: { port: 25565 }, minecraft: { port: 25000 } });
