import * as tournamentRepo from "../repos/tournamentRepo.js";

export const getAllTournaments = () => tournamentRepo.getAllTournaments();

export const getTournamentByName = (name) => tournamentRepo.getTournamentByName(name);

export const create = (name, endDate, startTime, tournamentImage, isTopScorerIncluded, teams) =>  {    
    const tournament = {
        name,
        endDate,
        startTime,
        includesTopScorer: isTopScorerIncluded,
        topScorer: null,
        teams,
        winnerTeam: null,
        symbol: tournamentImage
    }

    // Create chemistry to enforce the unpaid users and delete them from groups after the tournament started
    
 
    return tournamentRepo.create(tournament);
}

export const getAllTeams = (id) => tournamentRepo.getAllTeams(id);