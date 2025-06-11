import Users from "../models/user.js";

export const getUserbyUsername = (username) => Users.findOne({ username });

export const createUser = (user) => {
    const newUser = Users(user);
    return newUser.save();
};