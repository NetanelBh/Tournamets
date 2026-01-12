import Users from "../models/user.js";
import mongoose from "mongoose";

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

export const removeGroupFromUnpaidUsers = (groupId, usersIds) =>
	Users.updateMany({ _id: { $in: usersIds } }, { $pull: { groups: groupId } });

// When user leave some tournament, we want to remove also the groups that the user joined for this tournament
export const removeGroupsFromUser = (userId, groupsIds) => {
	return Users.updateOne({ _id: userId }, { $pull: { groups: { $in: groupsIds } } });
};

// Get all group users predictions for topScorer and winnerTeam(after the tournament is started)
export const getGroupPredictions = async ({ groupId, tournamentId }) => {
	tournamentId = new mongoose.Types.ObjectId(tournamentId);
	groupId = new mongoose.Types.ObjectId(groupId);

	return Users.aggregate([
		// 1️⃣ Users in group
		{
			$match: {
				groups: groupId,
			},
		},

		// 2️⃣ Top scorer prediction
		{
			$lookup: {
				from: "topscorerpredictions",
				let: { userId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$user", "$$userId"] },
									{ $eq: ["$group", groupId] },
									{ $eq: ["$tournament", tournamentId] },
								],
							},
						},
					},
				],
				as: "topScorerPrediction",
			},
		},

		// 3️⃣ Extract topScorer ObjectId
		{
			$addFields: {
				topScorerId: {
					$arrayElemAt: ["$topScorerPrediction.topScorer", 0],
				},
			},
		},

		// 4️⃣ Join players collection
		{
			$lookup: {
				from: "players",
				localField: "topScorerId",
				foreignField: "_id",
				as: "topScorerPlayer",
			},
		},

		// 5️⃣ Winner team prediction
		{
			$lookup: {
				from: "winnerteampredictions",
				let: { userId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$user", "$$userId"] },
									{ $eq: ["$group", groupId] },
									{ $eq: ["$tournament", tournamentId] },
								],
							},
						},
					},
				],
				as: "winnerTeamPrediction",
			},
		},

		// 6️⃣ Final output
		{
			$project: {
				_id: 0,
				username: 1,
				topScorer: {
					$ifNull: [{ $arrayElemAt: ["$topScorerPlayer.name", 0] }, "—"],
				},
				winnerTeam: {
					$ifNull: [{ $arrayElemAt: ["$winnerTeamPrediction.winnerTeam", 0] }, "—"],
				},
			},
		},
	]);
};
