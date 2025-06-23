import GroupModel from "../models/group.js";

export const createGroup = (group) => GroupModel(group).save();

export const getGroupByFilter = (filterObj) => GroupModel.findOne(filterObj);

export const addGroupMember = (groupId, userId) => {
	return GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true });
};

export const leaveGroup = (userId, groupId) => {
    return GroupModel.findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true });
};