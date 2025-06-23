import * as groupRepo from "../repos/groupRepo.js";
import {createGroupData} from "../utils/groupUtils.js";

export const createGroup = async (groupData) => {
	const group = createGroupData(groupData);
	return groupRepo.createGroup(group);
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
