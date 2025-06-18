import TournamentModel from "../models/tournament.js";

export const getAllTournaments = () => TournamentModel.find();

export const getTournamentByName = (name) => TournamentModel.findOne({ name });

export const getTournamentById = (id) => TournamentModel.findById(id);

export const getTournametsListByIds = (idsList) => TournamentModel.find({ _id: { $in: idsList } });

export const createTournament = (tournament) => TournamentModel(tournament).save();