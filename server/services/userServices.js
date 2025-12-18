import * as userRepo from "../repos/userRepo.js";
import {getGroupsByFilter, removeUserFromSelectedGroups} from "../repos/groupRepo.js";
import {removeBets, removeUserTournamentBets} from "../repos/betRepo.js";
import {getTournamentById} from "../services/tournamentServices.js";
import {removeUserWinnerTeamPredictionByTournament} from "../services/winnerTeamPredictServices.js";
import {removeTopScorerPredictionByTournament} from "../services/topScorerPredictServices.js";
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

export const leaveTournament = async (userId, tournamentId) => {
	// When leave the tournament we want to remove from the user also the groups that belongs to the tournament
	
	// Get the user
	const user = await getUserbyId(userId);
	// Get all the tournament groups
	const allGroups = await getGroupsByFilter({tournament: tournamentId});
	
	// Filter only the groups that the user joined
	const filteredGroups = user.groups.filter(group => allGroups.some(g => g._id.toString() === group.toString()));
	
	// Remove the groups from the user
	// await userRepo.removeGroupsFromUser(userId, filteredGroups);

	// // Remove the user from the groups
	// await removeUserFromSelectedGroups(userId);

	// // remove all user bets (matches)
	// await removeUserTournamentBets(userId, tournamentId);

	// remove the winner team bet by tournamentId
	await removeUserWinnerTeamPredictionByTournament(userId, tournamentId);

	// remove the top scorer bet if allowed in the tournament
	const tournament = await getTournamentById(tournamentId);
	if(tournament.topScorerBet) {
		await removeTopScorerPredictionByTournament(userId, tournamentId);
	}
	
	return userRepo.leaveTournament(userId, tournamentId)
};

export const addGroupToUser = (userId, groupId) => userRepo.addUserToGroup(userId, groupId);

export const leaveGroup = (userId, groupId) => userRepo.leaveGroup(userId, groupId);

export const removeUserBets = (userId, tournamentId, groupId) => removeBets(userId, tournamentId, groupId);
