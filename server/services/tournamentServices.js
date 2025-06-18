import * as tournamentRepo from "../repos/tournamentRepo.js";

export const getAllTournaments = () => tournamentRepo.getAllTournaments();

export const getTournamentByName = (name) => tournamentRepo.getTournamentByName(name);

export const createTournament = (name, startDate, endDate, startTime, tournamentImage) =>  {
    const tournament = {
        name,
        startDate,
        endDate,
        startTime,
        symbol: tournamentImage
    }
    
    return tournamentRepo.createTournament(tournament);
}