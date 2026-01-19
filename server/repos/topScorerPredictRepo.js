import topScorerPredictionModel from "../models/topScorerPrediction.js";

export const getTopScorerPredict = (filterObj) => topScorerPredictionModel.findOne(filterObj);

export const updatePredict = (filterObj, data) =>
	topScorerPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { upsert: true, new: true });

export const getAllByGroup = (filterObj) => topScorerPredictionModel.find(filterObj);

export const removeTopScorerPrediction = (userIds, tournament, group) =>
	topScorerPredictionModel.deleteMany({ user: { $in: userIds }, tournament, group });

export const removeTopScorerPredictionByTournament = (user, tournament) =>
	topScorerPredictionModel.deleteMany({ user, tournament });
