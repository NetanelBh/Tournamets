import { Schema, model } from "mongoose";

// In the tournament we decide if we want to include the top scorer or not
const tournamentSchema = new Schema({
  name: { type: String, required: true },
  startDate: {type: String, required: true},
  endDate: {type: String, required: true}, 
  startTime: {type: String, required: true},
  includesTopScorer: {type: Boolean, required: true},
  topScorer: { type: Schema.Types.ObjectId, ref: "Player" },
  winnerTeam: {type: String},
  symbol: {type: String, required: true},
}, { versionKey: false });

const Tournament = model("Tournament", tournamentSchema);

export default Tournament;