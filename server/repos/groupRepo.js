import GroupModel from "../models/group.js";

export const createGroup = (group) => GroupModel(group).save();

export const getGroupByFilter = (filterObj) => GroupModel.findOne(filterObj);

export const getGroupsByFilter = (filterObj) => GroupModel.find(filterObj);

export const updateGroup = (groupId, userId) => {
    return GroupModel.updateOne({ _id: groupId }, { $pull: { members: userId } })
};

export const addGroupMember = (groupId, userId) => {
	return GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: {id: userId} } }, { new: true });
};

export const leaveGroup = (userId, groupId) => {
    return GroupModel.findByIdAndUpdate(groupId, { $pull: { members: {id: userId} } }, { new: true });
};

export const removeUnpaidUsers = (groupId) => GroupModel.updateOne({_id: groupId}, { $pull: { members: {hasPaid: false} } });

// When user leave some tournament, we want to remove also the user from theg roups that the user joined
export const removeUserFromSelectedGroups = (userId) => {
    return GroupModel.updateMany({"members.id": userId}, {$pull: {members: {id: userId}}});
}