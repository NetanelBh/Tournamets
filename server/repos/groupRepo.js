import GroupModel from '../models/group.js';

export const createGroup = (group) => {
    const newGroup = GroupModel(group);
    return newGroup.save();
};

export const getGroupByName = (name) => {
    return GroupModel.findOne({name});
};

export const addGroupMember = (groupId, userId) => {
    return GroupModel.findOneAndUpdate({ _id: groupId }, { $addToSet: { members: userId } }, { new: true });
};