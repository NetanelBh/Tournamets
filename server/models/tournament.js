import { Schema, model } from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true}, 
}, { versionKey: false });

const Tournament = model("Tournament", tournamentSchema);

export default Tournament;