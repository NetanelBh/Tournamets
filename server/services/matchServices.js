import * as matchRepo from "../repos/matchRepo.js";

export const getAllMatches = async (tournamentId) => {
    return await matchRepo.getAllMatches(tournamentId);
}