import { Schema, model } from "mongoose";

const BetSchema = new Schema(
	{
		userId: { type: String, required: true },
		matchId: { type: Number, required: true },
		finalScore: {
			homeScore: { type: Number, required: true },
			awayScore: { type: Number, required: true },
		},
	},
	{ versionKey: false }
);

const Bet = model("Bet", BetSchema);

export default Bet;
