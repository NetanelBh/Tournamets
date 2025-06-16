import * as groupRepo from "../repos/groupRepo.js";

export const createGroup = async (name, code, userId) => {
	const group = { name, code, owner: userId, members: [userId] };
	return groupRepo.createGroup(group);
};

export const isGroupExist = (name) => {
	return groupRepo.getGroupByName(name);
};

export const addGroupMember = (groupId, userId) => {
    return groupRepo.addGroupMember(groupId, userId);
};
