import TournamentModel from "../models/tournament.js";

export const getAllTournaments = () => TournamentModel.find();

export const getTournamentByName = (name) => TournamentModel.findOne({ name });

export const getTournamentById = (id) => TournamentModel.findById(id);

export const create = (tournament) => TournamentModel(tournament).save();

export const getAllTeams = (id) => TournamentModel.distinct("teams", { _id: id });

export const createMatchesAtCreation = (matchesArray) => TournamentModel.insertMany(matchesArray);