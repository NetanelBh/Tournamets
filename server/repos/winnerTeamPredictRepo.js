import winnerTeamPredictionModel from "../models/tournamentWinnerTeamBet.js";

export const getTeamPredict = (filterObj) => winnerTeamPredictionModel.findOne(filterObj);

export const updatePredict = (filterObj, data) =>
	winnerTeamPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { upsert: true, new: true });

export const getAllByGroup = (filterObj) => winnerTeamPredictionModel.find(filterObj);

export const removeWinnerTeamPrediction = (usersids, tournament, group) =>
	winnerTeamPredictionModel.deleteMany({
		user: { $in: usersids },
		group,
		tournament,
	});

export const removeUserWinnerTeamPredictionByTournament = (user, tournament) =>
	winnerTeamPredictionModel.deleteMany({ user, tournament });
