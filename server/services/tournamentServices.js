import * as tournamentRepo from "../repos/tournamentRepo.js";

export const getAllTournaments = () => tournamentRepo.getAllTournaments();

export const getTournamentByName = (name) => tournamentRepo.getTournamentByName(name);

export const create = (name, endDate, startTime, tournamentImage, topScorerBet, teams, players) =>  {    
    const tournament = {
        name,
        endDate,
        startTime,
        topScorerBet,
        topScorer: null,
        teams,
        players,
        winnerTeam: null,
        symbol: tournamentImage
    }

    return tournamentRepo.create(tournament);
}

export const getAllTeams = (id) => tournamentRepo.getAllTeams(id);

export const getTournamentById = (id) => tournamentRepo.getTournamentById(id);