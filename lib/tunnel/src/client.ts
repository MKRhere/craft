import { copy, readAll, writeAll, race, close, timeout } from "./utils.ts";

type Opts = { server: Deno.ConnectOptions & { pwd: string }; minecraft: Deno.ConnectOptions };

export async function tunnelClient(opts: Opts): Promise<void> {
	await Deno.permissions.request({ name: "net" });

	console.log("Connecting to tunnel:", opts.server);

	const tunnel = timeout(await Deno.connect(opts.server));

	try {
		await writeAll(tunnel, new TextEncoder().encode(opts.server.pwd.padEnd(10)));
	} catch {
		close(tunnel);
		console.log("tunnel :: auth failed");
		return;
	}

	const buf = new Uint8Array(4);

	try {
		const res = await readAll(tunnel, buf);

		if (res === null) {
			close(tunnel);
			console.log("tunnel :: unable to reserve");
			return;
		}
	} catch {
		close(tunnel);
		console.log("tunnel :: could not read auth response");
		return;
	}

	const idx = new TextDecoder().decode(buf);

	console.log("tunnel :: connected to server, slot", idx);

	let mc: Deno.Conn | undefined = undefined;

	try {
		// await 4 more bytes
		await readAll(tunnel, buf);

		// connect to MC server
		mc = await Deno.connect(opts.minecraft);
		console.log("tunnel :: connected to Minecraft", idx);

		mc.write(buf);

		await race([copy(mc, tunnel), copy(tunnel, mc)]);
		console.log("tunnel :: connection closed", idx);
	} catch (e) {
		console.error(e);
		console.log("tunnel :: connection errored, closing", idx);
	}

	close(tunnel, mc);

	console.log("tunnel :: connection closed");
	return;
}

export async function proxyClient(opts: Opts): Promise<void> {
	await Deno.permissions.request({ name: "net" });

	console.log("Connecting to proxy:", opts.server);

	const proxy = timeout(await Deno.connect(opts.server));

	try {
		await writeAll(proxy, new TextEncoder().encode(opts.server.pwd.padEnd(10)));
	} catch {
		close(proxy);
		console.log("proxy :: auth failed");
		return;
	}

	const buf = new Uint8Array(4);
	const res = await readAll(proxy, buf);

	if (res === null) {
		console.log("proxy :: unable to reserve");
		return;
	}

	const idx = new TextDecoder().decode(buf);

	console.log("proxy :: connected to server, slot", idx);

	let server: Deno.Listener;

	try {
		// listen for MC client to connect
		server = await Deno.listen(opts.minecraft);
	} catch {
		close(proxy);
		console.log("proxy :: could not listen for Minecraft");
		return;
	}

	console.log("proxy :: ready for Minecraft to connect");

	const mc = timeout(await server.accept());

	console.log("proxy :: connected from Minecraft", idx);

	try {
		await race([copy(mc, proxy), copy(proxy, mc)]);
		console.log("proxy :: disconnected", idx);
	} catch (e) {
		console.error(e);
		console.log("proxy :: errored, closing proxy", idx);
	} finally {
		close(server, mc, proxy);
		return;
	}
}
