import topScorerPredictionModel from "../models/topScorerPrediction.js";

export const getTopScorerPredict = (filterObj) => topScorerPredictionModel.findOne(filterObj);

export const updatePredict = (filterObj, data) =>
	topScorerPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { upsert: true, new: true });

export const getAllByGroup = (filterObj) => topScorerPredictionModel.find(filterObj);

export const removeTopScorerPrediction = (filterObj) => topScorerPredictionModel.findOneAndDelete(filterObj);

export const removeTopScorerPredictionByTournament = (user, tournament) =>
	topScorerPredictionModel.deleteMany({ user, tournament });
