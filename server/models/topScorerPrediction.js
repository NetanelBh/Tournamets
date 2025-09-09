import { Schema, model } from "mongoose";

const topScorerPredictionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
        topScorer: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    },
    { versionKey: false }
);

const topScorerPrediction = model("TopScorerPrediction", topScorerPredictionSchema);

export default topScorerPrediction;