import Users from "../models/user.js";

export const getUserbyUsername = (username) => Users.findOne({ username });

export const getUserByEmail = (email) => Users.findOne({ email });

export const createUser = (user) => {
	const newUser = Users(user);
	return newUser.save();
};


export const updateUser = (userId, updatedUser) =>
	Users.findOneAndUpdate({ _id: userId }, { $set: updatedUser }, { new: true });


export const addTournamentToUser = (username, tournamentId) => {
	// Add to tournaments only if the tournament not exist in the array
	return Users.findOneAndUpdate({ username }, { $addToSet: { tournaments: tournamentId } }, { new: true });
};

export const addUserToGroup = (userId, groupId) => {
	// Add to groups only if the group not exist in the array
	return Users.findOneAndUpdate({ _id: userId }, { $addToSet: { groups: groupId } }, { new: true });
};