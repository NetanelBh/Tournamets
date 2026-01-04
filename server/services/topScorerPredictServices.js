import * as topScorerPredictRepo from "../repos/topScorerPredictRepo.js";

export const getTopScorerPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    
	return topScorerPredictRepo.getTopScorerPredict(filterObj);
};

export const updatePredict = (user, tournament, group, topScorer) => {
    const filterObj = {user, group, tournament};
    const data = {topScorer};
    return topScorerPredictRepo.updatePredict(filterObj, data);
};

export const getAllByGroup = (tournamentId, groupId) => {
    const filterObj = {group: groupId, tournament: tournamentId};
    return topScorerPredictRepo.getAllByGroup(filterObj);
};

export const removeTopScorerPrediction = (user, tournament, group) => {
    const filterObj = {user, group, tournament};
    return topScorerPredictRepo.removeTopScorerPrediction(filterObj);
};

export const removeTopScorerPredictionByTournament = (user, tournament) => {
    return topScorerPredictRepo.removeTopScorerPredictionByTournament(user, tournament);
}