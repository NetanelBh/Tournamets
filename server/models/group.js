import { Schema, model } from "mongoose";

const GroupSchema = new Schema(
	{
		name: { type: String, required: true },
		code: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		// The group owner will determine the points for each stage in the tournament
		points: {
			groupexactly: { type: Number, required: true },
			groupDirection: { type: Number, required: true },
			knockoutExactly: { type: Number, required: true },
			knockoutDirection: { type: Number, required: true },
		},
		members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
		tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
	},
	{ versionKey: false }
);

const Group = model("Group", GroupSchema);

export default Group;
