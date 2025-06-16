import * as userRepo from "../repos/userRepo.js";

import bcrypt from "bcrypt";

export const getUserbyUsername = (username) => userRepo.getUserbyUsername(username);

export const getUserByEmail = (email) => userRepo.getUserByEmail(email);

export const createUser = (user) => {
	const hashedPassword = bcrypt.hashSync(user.password, 10);
	const newUser = { ...user, password: hashedPassword };
	return userRepo.createUser(newUser);
};

export const addGroupToUser = (userId, groupId) => userRepo.addUserToGroup(userId, groupId);

export const updateUser = (userId, updatedUser) => userRepo.updateUser(userId, updatedUser);
