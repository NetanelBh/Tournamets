import * as tournamentRepo from "../repos/tournamentRepo.js";

export const getAllTournaments = () => tournamentRepo.getAllTournaments();

export const getTournamentByName = (name) => tournamentRepo.getTournamentByName(name);

export const createTournament = (name, startDate, endDate) =>  {
    const tournament = {
        name,
        startDate,
        endDate
    }
    return tournamentRepo.createTournament(tournament);
}