export const id = <T>(x: T) => x;

export const path = <T extends string, U extends {}>(segments: T[], obj: U) =>
	segments.reduce((o, key) => o && o[key], obj as any);

export const toBase64 = (s: string) => Buffer.from(s).toString("base64");

export const fromBase64 = (s: string) =>
	Buffer.from(s, "base64").toString("ascii");
