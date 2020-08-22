import type { Router as ExpressRouter } from "express";
import type { MojangProfile, MojangProfileTexture } from "../util/minecraft";

import { Router } from "express";
import { getSkin } from "../util/minecraft";
import { asyncHandler, createError } from "../util/asyncHandler";
import { toBase64 } from "../util";

const router = Router() as ExpressRouter;

router.get(
	"/session/minecraft/profile/:id",
	asyncHandler(async (req, res) => {
		let result;
		try {
			result = await getSkin({ id: req.params.id });
		} catch {}

		if (!result) throw createError("User not found", 404);

		const texture: MojangProfileTexture = {
			timestamp: Date.now(),
			profileId: req.params.id,
			profileName: result.name,
			textures: {
				SKIN: result.skin ? { url: result.skin } : undefined,
				CAPE: result.cape ? { url: result.cape } : undefined,
			},
		};

		const profile: MojangProfile = {
			id: req.params.id,
			name: result.name,
			properties: [
				{
					name: "textures",
					value: toBase64(JSON.stringify(texture)),
				},
			],
		};

		res.send(profile);
	}),
);

export default router;
