import TournamentModel from "../models/tournament";

export const getAllTournaments = () => TournamentModel.find();

export const getTournamentByName = (name) => TournamentModel.findOne({ name });

export const createTournament = (tournament) => TournamentModel(tournament).save();