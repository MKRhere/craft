export const MEMBER_TYPES = {
	PLAYER: "PLAYER",
	FACTION: "FACTION",
} as const;

export type MEMBER_TYPES = typeof MEMBER_TYPES;

export const DIPLOMACY_STANCES = {
	ALLY: "ALLY",
	NEUTRAL: "NEUTRAL",
	ENEMY: "ENEMY",
} as const;

export type DIPLOMACY_STANCES = typeof DIPLOMACY_STANCES;
