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

export const TIME = (() => {
	const MILLISECOND = 1;
	const SECOND = MILLISECOND * 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;
	const DAY = HOUR * 24;

	return {
		MILLISECOND,
		SECOND,
		MINUTE,
		HOUR,
		DAY,
	} as const;
})();
