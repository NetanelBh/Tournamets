import * as groupPredictRepo from "../repos/groupPredictRepo.js";

export const getUserPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
	return groupPredictRepo.getUserPredict(filterObj);
};

export const createPredict = (userId, tournamentId, groupId, topScorerId, winnerTeam) => {
    const data = {user: userId, group: groupId, tournament: tournamentId, topScorer: topScorerId, winnerTeam};
    return groupPredictRepo.createPredict(data);
};

export const updatePredict = (userId, tournamentId, groupId, topScorerId, winnerTeam) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    const data = {topScorerId, winnerTeam};
    return groupPredictRepo.updatePredict(filterObj, data);
};