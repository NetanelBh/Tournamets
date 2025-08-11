import GroupModel from "../models/group.js";

export const createGroup = (group) => GroupModel(group).save();

export const getGroupByFilter = (filterObj) => GroupModel.findOne(filterObj);

export const getGroupsByFilter = (filterObj) => GroupModel.find(filterObj);

export const updateGroup = (groupId, userId) => {
    return GroupModel.updateOne({ _id: groupId }, { $pull: { members: userId } })
};

export const addGroupMember = (groupId, userId) => {
	return GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true });
};

export const leaveGroup = (userId, groupId) => {
    return GroupModel.findByIdAndUpdate(groupId, { $pull: { members: {id: userId} } }, { new: true });
};