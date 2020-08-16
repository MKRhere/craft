import { Document, model, Schema, Types } from "mongoose";
import { MEMBER_TYPES, DIPLOMACY_STANCES } from "../util/consts";

type ObjectId = Types.ObjectId;
const ObjectId = Types.ObjectId;

type Diplomacy = {
	id: ObjectId;
	stance: keyof DIPLOMACY_STANCES;
};

type Member = {
	memberName: string;
	flag: string;
	diplomacy: Diplomacy[];
};

type Player = Member & {
	type: MEMBER_TYPES["PLAYER"];
	telegram: {
		userID: string;
		username: string;
	};
	faction: ObjectId;
};

type Faction = Member & {
	type: MEMBER_TYPES["FACTION"];
	members: ObjectId[];
};

type MemberUnion = Player | Faction;

const Diplomacy = new Schema<Diplomacy & Document>({
	id: { type: ObjectId, required: true },
	stance: { type: String, enum: Object.keys(DIPLOMACY_STANCES), required: true },
});

export default model<MemberUnion & Document>(
	"Member",
	new Schema({
		memberName: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: Object.keys(MEMBER_TYPES),
			required: true,
		},
		telegram: {
			type: {
				userID: {
					type: String,
					required: false,
				},
				username: {
					type: String,
					required: false,
				},
			},
			required: false,
		},
		faction: {
			type: ObjectId,
			required: false,
		},
		flag: {
			type: String,
			required: false,
		},
		diplomacy: {
			type: [Diplomacy],
			required: true,
			default: [],
		},
	}),
);
