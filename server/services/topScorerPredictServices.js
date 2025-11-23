import * as topScorerPredictRepo from "../repos/topScorerPredictRepo.js";

export const getTopScorerPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    
	return topScorerPredictRepo.getTopScorerPredict(filterObj);
};

export const createPredict = (userId, tournamentId, groupId, topScorerId) => {
    const data = {user: userId, group: groupId, tournament: tournamentId, topScorer: topScorerId};
    return topScorerPredictRepo.createPredict(data);
};

export const updatePredict = (userId, tournamentId, groupId, topScorerId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    const data = {topScorer: topScorerId};
    return topScorerPredictRepo.updatePredict(filterObj, data);
};

export const getAllByGroup = (tournamentId, groupId) => {
    const filterObj = {group: groupId, tournament: tournamentId};
    return topScorerPredictRepo.getAllByGroup(filterObj);
};