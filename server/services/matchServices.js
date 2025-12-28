import * as matchRepo from "../repos/matchRepo.js";

export const getAllMatches = (tournamentId) => matchRepo.getAllMatches(tournamentId);

export const createMatch = (match) => matchRepo.createMatch(match);

export const updateMatch = (matchId, paramsToUpdate) => matchRepo.updateMatch(matchId, paramsToUpdate);
