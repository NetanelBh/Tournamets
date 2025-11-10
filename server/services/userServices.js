import * as userRepo from "../repos/userRepo.js";
import bcrypt from "bcrypt";

export const getAllUsers = (tournamentId, groupId) => userRepo.getAllUsers(tournamentId, groupId);

export const getUserbyId = (userId) => userRepo.getUserbyId(userId);

export const getUserbyUsername = (username) => userRepo.getUserbyUsername(username);

export const getUserByEmail = (email) => userRepo.getUserByEmail(email);

export const createUser = (user) => {
	const hashedPassword = bcrypt.hashSync(user.password, 10);
	const newUser = { ...user, password: hashedPassword };
	return userRepo.createUser(newUser);
};

// Uses by auth router 
export const updateUser = (userId, updatedUser) => userRepo.updateUser(userId, updatedUser);

export const addTournamentToUser = (username, tournamentId) => userRepo.addTournamentToUser(username, tournamentId);

export const leaveTournament = (userId, tournamentId) => userRepo.leaveTournament(userId, tournamentId);

export const addGroupToUser = (userId, groupId) => userRepo.addUserToGroup(userId, groupId);

export const leaveGroup = (userId, groupId) => userRepo.leaveGroup(userId, groupId);