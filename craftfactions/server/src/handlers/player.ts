import type { Router as ExpressRouter } from "express";

import { Router } from "express";

import { asyncHandler, createError } from "../util/asyncHandler";
import { authentication } from "../middleware/authentication";
import Member from "../database/Member";
import { getStats } from "../util/minecraft";

const router = Router() as ExpressRouter;

router.get(
	"/player/:id/stats",
	asyncHandler([
		authentication,
		async (req, res) => {
			const member = await Member.findById(req.params.id);

			if (!member || member.type !== "PLAYER") throw createError("Player not found", 404);

			res.json(await getStats(member.memberName));
		},
	]),
);

router.get(
	"/player",
	asyncHandler([authentication, async (req, res) => res.json(await Member.find({ type: { $ne: "FACTION" } }))]),
);

router.get(
	"/faction",
	asyncHandler([authentication, async (req, res) => res.json(await Member.find({ type: { $ne: "PLAYER" } }))]),
);

export default router;
