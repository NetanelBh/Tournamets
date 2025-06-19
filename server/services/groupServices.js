import * as groupRepo from "../repos/groupRepo.js";

export const createGroup = async (name, code, userId) => {
	const group = { name, code, owner: userId, members: [userId] };
	return groupRepo.createGroup(group);
};

export const isExist = (paramObj) => {
	return groupRepo.isExist(paramObj);
};

export const getGroupByFilter = (filterObj) => {
	return groupRepo.getGroupByFilter(filterObj);
};

export const addGroupMember = (groupId, userId) => {
    return groupRepo.addGroupMember(groupId, userId);
};

export const leaveGroup = (userId, groupId) => {
	return groupRepo.leaveGroup(userId, groupId);
};
