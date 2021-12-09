import { Document, Model, model, Schema, SchemaTypes, Types } from "mongoose";
import { MEMBER_TYPES, DIPLOMACY_STANCES } from "../util/consts";

type ObjectId = Types.ObjectId;
const ObjectId = SchemaTypes.ObjectId;

export type Diplomacy = {
	id: ObjectId;
	stance: keyof DIPLOMACY_STANCES;
};

type MemberBase = {
	name: string;
	flag: string;
	diplomacy: Diplomacy[];
};

export type Player = MemberBase & {
	type: MEMBER_TYPES["PLAYER"];
	skin: string;
	cape: string;
	faction: ObjectId;
	telegram: {
		userID: ObjectId;
		username: string;
	};
};

export type Faction = {
	type: MEMBER_TYPES["FACTION"];
	members: ObjectId[];
};

export type Member = Player | Faction;

const Diplomacy = new Schema<Diplomacy>({
	id: { type: ObjectId, required: true },
	stance: {
		type: String,
		enum: Object.keys(DIPLOMACY_STANCES),
		required: true,
	},
});

const Member = model(
	"member",
	new Schema<Player | Faction>({
		name: { type: String, required: true },
		type: {
			type: String,
			required: true,
			enum: [MEMBER_TYPES.PLAYER, MEMBER_TYPES.FACTION],
		},
		flag: { type: String, required: true },
		diplomacy: { type: [Diplomacy], required: true, default: [] },
	}),
);

export const Player = Member.discriminator<Player & Document, Model<Player>>(
	"Player",
	new Schema<Player>({
		skin: {
			type: String,
			required: false,
		},
		cape: {
			type: String,
			required: false,
		},
		faction: {
			type: ObjectId,
			required: false,
		},
		telegram: {
			userID: { type: String, required: false },
			username: { type: String, required: false },
		},
	}),
);

export const Faction = Member.discriminator(
	"Faction",
	new Schema<Faction>({
		members: {
			type: [Types.ObjectId],
			required: true,
			default: [],
		},
	}),
);

export default Member;
