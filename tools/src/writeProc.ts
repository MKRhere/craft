import { promises as fs } from "fs";

export default (name: string, path: string, ctx: any) =>
	fs
		.writeFile(path, JSON.stringify(ctx, null, "\t"))
		.then(() => console.log("[info] written config for", name))
		.catch(e =>
			console.error(
				"[error] could not write config for",
				name,
				e.message,
			),
		);
