import { sleep, copy, readAll, close } from "./utils.ts";

type Opts = { server: Deno.ConnectOptions; minecraft: Deno.ConnectOptions };

async function tunnelClient(opts: Opts): Promise<void> {
	const tunnel = await Deno.connect(opts.server);

	tunnel.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	const res = await readAll(tunnel, buf);

	if (res === null) {
		console.log("tunnel :: unable to reserve, retrying...");
		await sleep(500);
		return tunnelClient(opts);
	}

	console.log("tunnel :: connected to server, slot", new TextDecoder().decode(buf));

	// await 4 more bytes
	await readAll(tunnel, buf);

	// connect to MC server
	const mc = await Deno.connect(opts.minecraft);
	console.log("tunnel :: connected to Minecraft");

	mc.write(buf);

	try {
		await Promise.race([copy(mc, tunnel), copy(tunnel, mc)]);
		console.log("tunnel :: connection closed");
	} catch (e) {
		console.error(e);
		console.log("tunnel :: connection errored, closing");
	}

	close(tunnel, mc);

	await sleep(500);
	return tunnelClient(opts);
}

async function proxyClient(opts: Opts): Promise<void> {
	const proxy = await Deno.connect(opts.server);

	proxy.write(new TextEncoder().encode("password  "));
	const buf = new Uint8Array(4);
	const res = await readAll(proxy, buf);

	if (res === null) {
		console.log("proxy :: unable to reserve, retrying...");
		await sleep(500);
		return proxyClient(opts);
	}

	console.log("proxy :: connected to server, slot", new TextDecoder().decode(buf));

	// listen for MC client to connect
	for await (const mc of Deno.listen(opts.minecraft)) {
		console.log("proxy :: connected from Minecraft");

		try {
			await Promise.race([copy(mc, proxy), copy(proxy, mc)]);
			console.log("proxy :: disconnected");
		} catch (e) {
			console.error(e);
			console.log("proxy :: errored, closing proxy");
		} finally {
			close(mc, proxy);
			await sleep(500);
			return proxyClient(opts);
		}
	}
}

Array(20)
	.fill(null)
	.forEach(() => tunnelClient({ server: { port: 15000 }, minecraft: { port: 25888 } }));

proxyClient({ server: { port: 25565 }, minecraft: { port: 25000 } });
