import Users from "../models/user.js";

export const getUserbyUsername = (username) => Users.findOne({ username });

export const getUserByEmail = (email) => Users.findOne({ email });

export const createUser = (user) => {
	const newUser = Users(user);
	return newUser.save();
};

export const addUserToGroup = (userId, groupId) => {
	// Add to groups only if the group not exist in the array
	return Users.findOneAndUpdate({ _id: userId }, { $addToSet: { groups: groupId } }, { new: true });
};

export const updateUser = (userId, updatedUser) =>
	Users.findOneAndUpdate({ _id: userId }, { $set: updatedUser }, { new: true });
