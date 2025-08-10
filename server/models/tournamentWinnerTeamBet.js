import { Schema, model } from "mongoose";

const winnerTeamPredictionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
        winnerTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    },
    { versionKey: false }
);

const winnerTeamPrediction = model("WinnerTeam", winnerTeamPredictionSchema);

export default winnerTeamPrediction;