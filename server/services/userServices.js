import * as userRepo from "../repos/userRepo.js";

import bcrypt from "bcrypt";

export const getUserbyUsername = (username) => {
    return userRepo.getUserbyUsername(username);
};

export const createUser = (user) => {
    const password = user.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { ...user, password: hashedPassword}
    return userRepo.createUser(newUser);
}