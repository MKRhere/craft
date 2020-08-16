export const id = <T>(x: T) => x;

export const path = <T extends string, U extends {}>(segments: T[], obj: U) =>
	segments.reduce((o, key) => o && o[key], obj as any);
