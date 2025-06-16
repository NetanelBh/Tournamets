import { Schema, model } from "mongoose";

const MatchSchema = new Schema(
	{
		tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
		homeTeam: { type: String, required: true },
		awayTeam: { type: String, required: true },
		kickoffTime: { type: Date, required: true },
		stage: { type: String, required: true },
		round: { type: String, required: true },
		finalScore: {
			homeScore: { type: Number, required: true },
			awayScore: { type: Number, required: true },
		},
	},
	{ versionKey: false }
);

const Match = model("Match", MatchSchema);

export default Match;
