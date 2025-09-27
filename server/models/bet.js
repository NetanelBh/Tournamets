import { Schema, model } from "mongoose";

// Each user has bet document for all trounament matches. the document contains an array of match bets
const BetSchema = new Schema(
	{
		tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
		matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
		betScore: {
			homeScore: { type: Number, required: true },
			awayScore: { type: Number, required: true },
		},
	},
	{ versionKey: false }
);

const Bet = model("Bet", BetSchema);

export default Bet;
