import * as matchRepo from "../repos/matchRepo.js";

export const getAllMatches = (tournamentId) => matchRepo.getAllMatches(tournamentId);

export const createMatch = (tournamentId, match) => matchRepo.createMatch(tournamentId, match);
