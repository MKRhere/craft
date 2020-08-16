import path from "path";
import fs from "fs/promises";

type Stats = {
	stats: Record<string, Record<string, number>>;
	DataVersion: number;
};

const env = process.env as { MC_SERVER_PATH: string };

const MC_SERVER_PATH = path.resolve(__dirname, "..", env.MC_SERVER_PATH);

const read = (...pathSegs: string[]) => fs.readFile(path.resolve(...pathSegs), "utf-8");

export async function getUsercache(): Promise<{ name: "string"; uuid: string; expiresOn: string }[]> {
	const cache = await read(MC_SERVER_PATH, "usercache.json");
	return JSON.parse(cache);
}

export function getStats(playername: string): Promise<Stats | null>;
export function getStats(playername: string, path: string): Promise<Stats["stats"][string] | null>;
export function getStats(playername: string, path: [string, string]): Promise<Stats["stats"][string][string] | null>;

export async function getStats(
	playername: string,
	path?: string | [string, string],
): Promise<Stats | null | Stats["stats"][string] | Stats["stats"][string][string]> {
	const usercache = await getUsercache();
	const player = usercache.find(user => user.name === playername);

	if (!player) return null;

	const stats = JSON.parse(await read(MC_SERVER_PATH, "world/stats", player.uuid + ".json")) as Stats;
	if (!path) return stats;

	if (typeof path === "string") {
		const key = Object.keys(stats.stats).find(stat => stat === path);
		if (!key) return null;

		return stats.stats[key];
	} else if (Array.isArray(path)) {
		const key1 = Object.keys(stats.stats).find(stat => stat === path[0]);
		if (!key1) return null;
		const key2 = Object.keys(stats.stats[key1]).find(stat => stat === path[1]);
		if (!key2) return null;

		return stats.stats[key1][key2];
	}
	return null;
}
