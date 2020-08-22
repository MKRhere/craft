import path from "path";
import oldFS, { promises as fs } from "fs";

import axios from "axios";

import Member, { Player } from "../database/Member";
import { Document } from "mongoose";
import { fromBase64 } from ".";

export type MinecraftStats = {
	stats: Record<string, Record<string, number>>;
	DataVersion: number;
};

export type MojangProfile = {
	id: string;
	name: string;
	properties: [
		{
			name: "textures";
			value: string;
		},
	];
};

export type MojangProfileTexture = {
	timestamp: number;
	profileId: string;
	profileName: string;
	textures?: {
		SKIN?: {
			url: string;
		};
		CAPE?: {
			url: string;
		};
	};
};

const env = process.env as { MC_SERVER_PATH: string };

const MC_SERVER_PATH = path.resolve(__dirname, "..", env.MC_SERVER_PATH);

const defaultSkins = {
	steve: oldFS.readFileSync(
		path.resolve(__dirname, "../..", "assets/skins/steve.png"),
		"base64",
	),
	alex: oldFS.readFileSync(
		path.resolve(__dirname, "../..", "assets/skins/alex.png"),
		"base64",
	),
};

const read = (...pathSegs: string[]) =>
	fs.readFile(path.resolve(...pathSegs), "utf-8");

export async function getUsercache(): Promise<
	{ name: "string"; uuid: string; expiresOn: string }[]
> {
	const cache = await read(MC_SERVER_PATH, "usercache.json");
	return JSON.parse(cache);
}

export function getStats(playername: string): Promise<MinecraftStats | null>;
export function getStats(
	playername: string,
	path: string,
): Promise<MinecraftStats["stats"][string] | null>;
export function getStats(
	playername: string,
	path: [string, string],
): Promise<MinecraftStats["stats"][string][string] | null>;

export async function getStats(
	playername: string,
	path?: string | [string, string],
): Promise<
	| MinecraftStats
	| null
	| MinecraftStats["stats"][string]
	| MinecraftStats["stats"][string][string]
> {
	const usercache = await getUsercache();
	const player = usercache.find(user => user.name === playername);

	if (!player) return null;

	const stats = JSON.parse(
		await read(MC_SERVER_PATH, "world/stats", player.uuid + ".json"),
	) as MinecraftStats;
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

// "Borrowed" under the MIT license from:
// https://github.com/crafatar/crafatar/blob/9d2fe0c45424de3ebc8e0b10f9446e7d5c3738b2/lib/skins.js#L90-L108
export const defaultSteveOrAlex = (uuid: string) => {
	if (uuid.length <= 16) {
		// we can't get the skin type by username
		return "steve";
	} else {
		var lsbs_even =
			parseInt(uuid[7], 16) ^
			parseInt(uuid[15], 16) ^
			parseInt(uuid[23], 16) ^
			parseInt(uuid[31], 16);
		return lsbs_even ? "alex" : "steve";
	}
};

export const getMojangUUID = async (
	profileNames: string[],
): Promise<string[]> => {
	const apiroot = "https://api.mojang.com/profiles/minecraft";

	const response = (await axios.post(apiroot, profileNames)).data as {
		id: string;
		name: string;
		legacy?: true;
		demo?: true;
	}[];

	return response.map(x => x.id);
};

export const getOfficialSkin = async (
	opts: { profileName: string } | { uuid: string },
): Promise<{
	name: string;
	skin?: string;
	cape?: string;
}> => {
	let uuid: string;

	if ("profileName" in opts) {
		const mojangId = (await getMojangUUID([opts.profileName]))[0] as
			| string
			| undefined;

		if (mojangId) uuid = mojangId;
		else return { name: opts.profileName };
	} else uuid = opts.uuid;

	const apiroot = "https://sessionserver.mojang.com/session/minecraft/profile";

	const response = (await axios.get(`${apiroot}/${uuid}`))
		.data as MojangProfile;

	if (!response.properties || !response.properties.length)
		return { name: response.name };

	const decoded = JSON.parse(
		fromBase64(response.properties[0].value),
	) as MojangProfileTexture;

	return {
		name: decoded.profileName,
		skin: decoded.textures?.SKIN?.url,
		cape: decoded.textures?.CAPE?.url,
	};
};

export const getSkin = async (
	opts: { playerName: string } | { id: string },
) => {
	// attempt to get player and skin from db
	const player = (await Member.findOne({
		...("playerName" in opts
			? { memberName: opts.playerName }
			: { _id: opts.id }),
		type: "PLAYER",
	})) as (Player & Document) | null;

	// I've never met this person in my life!
	if (!player) throw new Error("Unknown player");

	if (player.skin) {
		// Send off our skin!
		return { name: player.memberName, skin: player.skin, cape: player.cape };
	} else {
		let mojangProfile;

		try {
			// Let's check if Mojang has a skin
			mojangProfile = await getOfficialSkin({
				profileName: player.memberName,
			});
		} catch {}

		if (mojangProfile?.skin) {
			return { name: player.memberName, skin: mojangProfile.skin };
		} else {
			// Nobody has your skins here!
			const steveOrAlex = defaultSteveOrAlex(player._id.toString());
			return {
				name: player.memberName,
				skin: defaultSkins[steveOrAlex],
			};
		}
	}
};
