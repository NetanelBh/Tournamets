import { Schema, model } from "mongoose";

const GroupSchema = new Schema(
	{
		name: { type: String, required: true },
		code: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
		tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
		// The group owner will determine the points for each stage in the tournament
		points: {
			groupStage: {
				exactScore: { type: Number, required: true },
				directionScore: { type: Number, required: true },
			},
			knockoutStage: {
				pointsMethod: { type: String, enum: ["samePoints", "differentPoints"], required: true },
				samePoints: {
					exactScore: Number,
					directionScore: Number,
				},
				differentPoints: {
					roundOf16: {
						exactScore: Number,
						directionScore: Number,
					},
					quarterFinal: {
						exactScore: Number,
						directionScore: Number,
					},
					semiFinal: {
						exactScore: Number,
						directionScore: Number,
					},
					final: {
						exactScore: Number,
						directionScore: Number,
					},
				},
			},
		},
	},
	{ versionKey: false }
);

const Group = model("Group", GroupSchema);

export default Group;
