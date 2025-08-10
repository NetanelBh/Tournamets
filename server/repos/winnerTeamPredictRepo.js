import winnerTeamPredictionModel from "../models/tournamentWinnerTeamBet.js";

export const getUserPredict = (filterObj) => winnerTeamPredictionModel.findOne(filterObj);

export const createPredict = (data) => winnerTeamPredictionModel(data).save();

export const updatePredict = (filterObj, data) => {
	return winnerTeamPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { new: true });
};
