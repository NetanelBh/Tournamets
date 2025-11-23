import topScorerPredictionModel from "../models/topScorerPrediction.js";

export const getTopScorerPredict = (filterObj) => topScorerPredictionModel.findOne(filterObj);

export const createPredict = (data) => topScorerPredictionModel(data).save();

export const updatePredict = (filterObj, data) => {
	return topScorerPredictionModel.findOneAndUpdate(filterObj, { $set: data }, { new: true });
};

export const getAllByGroup = (filterObj) => topScorerPredictionModel.find(filterObj);