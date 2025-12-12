import Users from "../models/user.js";

export const getAllUsers = (tournamentId, groupId) => Users.find({ tournaments: tournamentId, groups: groupId });

export const getUserbyId = (userId) => Users.findOne({ _id: userId });

export const getUserbyUsername = (username) => Users.findOne({ username });

export const getUserByEmail = (email) => Users.findOne({ email });

export const createUser = (user) => {
	const newUser = Users(user);
	return newUser.save();
};

export const updateUser = (userId, updatedUser) => Users.findOneAndUpdate(userId, { $set: updatedUser }, { new: true });

export const addTournamentToUser = (username, tournamentId) => {
	// Add to tournaments only if the tournament not exist in the array
	return Users.findOneAndUpdate({ username }, { $addToSet: { tournaments: tournamentId } }, { new: true });
};

export const leaveTournament = (userId, tournamentId) => {
	return Users.findByIdAndUpdate(userId, { $pull: { tournaments: tournamentId } }, { new: true });
};

export const addUserToGroup = (userId, groupId) => {
	// Add to groups only if the group not exist in the array
	return Users.findByIdAndUpdate(userId, { $addToSet: { groups: groupId } }, { new: true });
};

export const leaveGroup = (userId, groupId) => {
	return Users.findByIdAndUpdate(userId, { $pull: { groups: groupId } }, { new: true });
};

// When user leave some tournament, we want to remove also the groups that the user joined for this tournament
export const removeGroupsFromUser = (userId, groupsIds) => {
	return Users.updateOne({ _id: userId }, { $pull: { groups: { $in: groupsIds } } });
};