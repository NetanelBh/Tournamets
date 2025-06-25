import GroupPredictModel from "../models/groupPrediction.js";

export const getUserPredict = (filterObj) => GroupPredictModel.findOne(filterObj);

export const createPredict = (data) => GroupPredictModel(data).save();

export const updatePredict = (filterObj, data) => {
	return GroupPredictModel.findOneAndUpdate(filterObj, { $set: data }, { new: true });
};
