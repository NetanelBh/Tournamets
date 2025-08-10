import topScorerPredictionModel from "../models/topScorerPrediction.js";

export const getUserPredict = (filterObj) => topScorerPredictionModel.findOne(filterObj);

export const createPredict = (data) => topScorerPredictionModel(data).save();

export const updatePredict = (filterObj, data) => {
	return topScorerPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { new: true });
};
