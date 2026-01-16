import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	lastActivityAt: { type: Date, required: true },
	revoked: { type: Boolean, default: false },
	expiresAt: { type: Date, required: true },
});

export default model("Session", sessionSchema);
