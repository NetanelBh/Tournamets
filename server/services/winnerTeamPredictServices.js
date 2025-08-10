import * as winnerTeamPredictRepo from "../repos/winnerTeamPredictRepo.js";

export const getUserPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    return winnerTeamPredictRepo.getUserPredict(filterObj);
};

export const createPredict = (userId, tournamentId, groupId, winnerTeam) => {
    const data = {user: userId, group: groupId, tournament: tournamentId, winnerTeam};
    return winnerTeamPredictRepo.createPredict(data);
};

export const updatePredict = (userId, tournamentId, groupId, winnerTeam) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    const data = {winnerTeam};
    return winnerTeamPredictRepo.updatePredict(filterObj, data);
};