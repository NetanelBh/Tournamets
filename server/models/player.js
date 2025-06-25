import { Schema, model } from "mongoose";

const PlayerSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { versionKey: false }
);

const Player = model("Player", PlayerSchema);

export default Player;