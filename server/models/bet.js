import { Schema, model } from "mongoose";

const BetSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
		finalScore: {
			homeScore: { type: Number, required: true },
			awayScore: { type: Number, required: true },
		},
	},
	{ versionKey: false }
);

const Bet = model("Bet", BetSchema);

export default Bet;
