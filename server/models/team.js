import { Schema, model } from "mongoose";

const TeamSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { versionKey: false }
);

const Team = model("Team", TeamSchema);

export default Team;