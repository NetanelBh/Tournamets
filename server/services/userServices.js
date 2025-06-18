import * as userRepo from "../repos/userRepo.js";
import {getTournametsListByIds} from "../repos/tournamentRepo.js";

import bcrypt from "bcrypt";

export const getUserbyId = (userId) => userRepo.getUserbyId(userId);

export const getUserByEmail = (email) => userRepo.getUserByEmail(email);

export const createUser = (user) => {
	const hashedPassword = bcrypt.hashSync(user.password, 10);
	const newUser = { ...user, password: hashedPassword };
	return userRepo.createUser(newUser);
};

export const getUserTournaments = (tournamentIdsList) => {
    return getTournametsListByIds(tournamentIdsList);
};

export const updateUser = (userId, updatedUser) => userRepo.updateUser(userId, updatedUser);

export const addTournamentToUser = (username, tournamentId) => userRepo.addTournamentToUser(username, tournamentId);

export const addGroupToUser = (userId, groupId) => userRepo.addUserToGroup(userId, groupId);