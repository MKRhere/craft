import { copy, readAll } from "./utils.ts";

type Opts = { server: Deno.ConnectOptions; minecraft: Deno.ConnectOptions };

async function tunnelClient(opts: Opts) {
	const tunnel = await Deno.connect(opts.server);

	tunnel.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	await readAll(tunnel, buf);

	// connect to MC server
	const mc = await Deno.connect(opts.minecraft);
	console.log("tunnel :: connected to Minecraft");

	try {
		await Promise.race([copy(mc, tunnel), copy(tunnel, mc)]);
		console.log("tunnel :: connection closed");
	} catch {
		console.log("tunnel :: connection errored, closing");
	}

	tunnel.close();
	mc.close();

	tunnelClient(opts);
}

async function proxyClient(opts: Opts) {
	const proxy = await Deno.connect(opts.server);

	proxy.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	await readAll(proxy, buf);

	// listen for MC client to connect
	for await (const mc of Deno.listen(opts.minecraft)) {
		console.log("proxy :: connected from Minecraft");

		copy(proxy, mc).catch(() => {
			try {
				mc.close();
				console.log("proxy :: errored, closing Minecraft");
			} catch {}
			try {
				proxy.close();
				console.log("proxy :: errored, closing proxy");
			} catch {}
		});

		try {
			await copy(mc, proxy);
			console.log("proxy :: Minecraft disconnected");
		} catch {
			console.log("proxy :: errored, closing proxy");
		}

		try {
			proxy.close();
		} catch {}
	}
}

tunnelClient({ server: { port: 15000 }, minecraft: { port: 25888 } });
proxyClient({ server: { port: 25565 }, minecraft: { port: 25000 } });
