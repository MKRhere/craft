import { sleep, copy, readAll, close } from "./utils.ts";

type Opts = { server: Deno.ConnectOptions & { pwd: string }; minecraft: Deno.ConnectOptions };

export async function tunnelClient(opts: Opts): Promise<void> {
	await Deno.permissions.request({ name: "net", host: opts.server.hostname });

	console.log("Connecting to tunnel:", opts.server);

	const tunnel = await Deno.connect(opts.server);

	tunnel.write(new TextEncoder().encode(opts.server.pwd.padEnd(10)));
	const buf = new Uint8Array(4);
	const res = await readAll(tunnel, buf);

	if (res === null) {
		console.log("tunnel :: unable to reserve, retrying...");
		await sleep(500);
		return tunnelClient(opts);
	}

	const idx = new TextDecoder().decode(buf);

	console.log("tunnel :: connected to server, slot", idx);

	// await 4 more bytes
	await readAll(tunnel, buf);

	// connect to MC server
	const mc = await Deno.connect(opts.minecraft);
	console.log("tunnel :: connected to Minecraft", idx);

	mc.write(buf);

	try {
		await Promise.race([copy(mc, tunnel), copy(tunnel, mc)]);
		console.log("tunnel :: connection closed", idx);
	} catch (e) {
		console.error(e);
		console.log("tunnel :: connection errored, closing", idx);
	}

	close(tunnel, mc);

	await sleep(500);
	return tunnelClient(opts);
}

export async function proxyClient(opts: Opts): Promise<void> {
	await Deno.permissions.request({ name: "net", host: opts.server.hostname });

	console.log("Connecting to proxy:", opts.server);

	const proxy = await Deno.connect(opts.server);

	proxy.write(new TextEncoder().encode(opts.server.pwd.padEnd(10)));
	const buf = new Uint8Array(4);
	const res = await readAll(proxy, buf);

	if (res === null) {
		console.log("proxy :: unable to reserve, retrying...");
		throw new Error("Connection closed");
	}

	const idx = new TextDecoder().decode(buf);

	console.log("proxy :: connected to server, slot", idx);

	await Deno.permissions.request({ name: "net", host: opts.minecraft.hostname || "0.0.0.0" });

	// listen for MC client to connect
	const server = await Deno.listen(opts.minecraft);
	const mc = await server.accept();

	console.log("proxy :: connected from Minecraft", idx);

	try {
		await Promise.race([copy(mc, proxy), copy(proxy, mc)]);
		console.log("proxy :: disconnected", idx);
	} catch (e) {
		console.error(e);
		console.log("proxy :: errored, closing proxy", idx);
	} finally {
		close(server, mc, proxy);
		throw new Error("Connection closed");
	}
}
