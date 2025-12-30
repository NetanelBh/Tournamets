import * as winnerTeamPredictRepo from "../repos/winnerTeamPredictRepo.js";

export const getTeamPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    return winnerTeamPredictRepo.getTeamPredict(filterObj);
};

export const updatePredict = (user, tournament, group, winnerTeam) => {
    const filterObj = {user, group, tournament};
    const data = {winnerTeam};
    return winnerTeamPredictRepo.updatePredict(filterObj, data);
};

export const getAllByGroup = (tournamentId, groupId) => {
    const filterObj = {group: groupId, tournament: tournamentId};
    return winnerTeamPredictRepo.getAllByGroup(filterObj);
};

export const removeWinnerTeamPrediction = (user, tournament, group) => {
    const filterObj = {user, group, tournament};
    return winnerTeamPredictRepo.removeWinnerTeamPrediction(filterObj);
};

export const removeUserWinnerTeamPredictionByTournament = (userId, tournamentId) => {
    return winnerTeamPredictRepo.removeUserWinnerTeamPredictionByTournament(userId, tournamentId);
};