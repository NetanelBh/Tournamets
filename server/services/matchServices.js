import * as matchRepo from "../repos/matchRepo.js";

export async function getAllMatches(tournamentId) {
    return await matchRepo.getAllMatches(tournamentId);
}