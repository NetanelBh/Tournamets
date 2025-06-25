import { Schema, model } from "mongoose";

const GroupPredictionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
        topScorer: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        winnerTeam: { type: String, required: true },
    },
    { versionKey: false }
);

const GroupPrediction = model("GroupPrediction", GroupPredictionSchema);

export default GroupPrediction;