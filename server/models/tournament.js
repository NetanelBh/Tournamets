import { Schema, model } from "mongoose";

const tournamentSchema = new Schema({
  name: { type: String, required: true },
  startDate: {type: String, required: true},
  endDate: {type: String, required: true}, 
  startTime: {type: String, required: true},
  topScorer: { type: Schema.Types.ObjectId, ref: "Player" },
  symbol: {type: String, required: true},
}, { versionKey: false });

const Tournament = model("Tournament", tournamentSchema);

export default Tournament;