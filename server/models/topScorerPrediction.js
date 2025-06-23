import { Schema, model } from "mongoose";   

// Model for the top scorer prediction
const topScorerPredictionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    // Make sure that the prediction is for this group(perhaps the user has a lot of groups with different top scorer)
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
}, { versionKey: false });

const TopScorerPrediction = model("TopScorerPrediction", topScorerPredictionSchema);

export default TopScorerPrediction;