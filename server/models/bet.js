import { Schema, model } from "mongoose";

// Each user has bet document for all trounament matches. the document contains an array of match bets
const BetSchema = new Schema(
	{
		tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		matchBets: [
			{
				match: { type: Schema.Types.ObjectId, ref: "Match", required: true },
				finalScore: {
					homeScore: { type: Number, required: true },
					awayScore: { type: Number, required: true },
				},
			},
		],
		topScorerBet: { type: Schema.Types.ObjectId, ref: "Player" },
		winnerTeam: { type: String },
	},
	{ versionKey: false }
);

const Bet = model("Bet", BetSchema);

export default Bet;
