import { Schema, model } from "mongoose";

const GroupSchema = new Schema(
	{
		name: { type: String, required: true },
		code: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		members: [{ type: Schema.Types.ObjectId, ref: "User" }],
		tournaments: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
	},
	{ versionKey: false }
);

const Group = model("Group", GroupSchema);

export default Group;
