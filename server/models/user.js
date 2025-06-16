import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
        // Field to check if the user is verified(active the account with mail)
        isVerified: { type: Boolean, default: false },
        groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    }, {versionKey: false}
)

const Users = model("User", UserSchema);

export default Users;