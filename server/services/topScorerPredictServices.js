import * as topScorerPredictRepo from "../repos/topScorerPredictRepo.js";

export const getUserPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
	return topScorerPredictRepo.getUserPredict(filterObj);
};

export const createPredict = (userId, tournamentId, groupId, topScorerId) => {
    const data = {user: userId, group: groupId, tournament: tournamentId, topScorer: topScorerId};
    return topScorerPredictRepo.createPredict(data);
};

export const updatePredict = (userId, tournamentId, groupId, topScorerId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    const data = {topScorerId};
    return topScorerPredictRepo.updatePredict(filterObj, data);
};