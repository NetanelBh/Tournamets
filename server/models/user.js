import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true },
        phone: { type: Number, required: true },
        password: { type: String },
    }, {versionKey: false}
)

const Users = model("User", UserSchema);

export default Users;