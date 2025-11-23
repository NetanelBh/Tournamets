import * as winnerTeamPredictRepo from "../repos/winnerTeamPredictRepo.js";

export const getTeamPredict = (userId, tournamentId, groupId) => {
    const filterObj = {user: userId, group: groupId, tournament: tournamentId};
    return winnerTeamPredictRepo.getTeamPredict(filterObj);
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

export const getAllByGroup = (tournamentId, groupId) => {
    const filterObj = {group: groupId, tournament: tournamentId};
    return winnerTeamPredictRepo.getAllByGroup(filterObj);
};