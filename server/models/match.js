import { Schema, model } from "mongoose";

const MatchSchema = new Schema(
	{
		matchId: { type: Number, required: true },
		homeTeam: { type: String, required: true },
		awayTeam: { type: String, required: true },
		kickoffTime: { type: Date, required: true },
		// Grout/Knockout
		stage: { type: String, required: true },
		// 1 \ 2 \ 3 \ 1/8 \ 1/4 \ 1/2 \ final
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
