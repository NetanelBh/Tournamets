import { Schema, model } from "mongoose";

const PlayerSchema = new Schema(
    {
        name: { type: String, required: true },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    },
    { versionKey: false }
);

const Player = model("Player", PlayerSchema);

export default Player;