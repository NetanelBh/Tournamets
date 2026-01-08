import TournamentModel from "../models/tournament.js";

export const getAllTournaments = () => TournamentModel.find();

// Get only the tournaments that are scheduled and didn't start yet(to reschedule to prevent the case of removed after server restart)
export const getScheduledTournaments = () => {
	return TournamentModel.find({
		startTime: { $gt: new Date().toISOString() },
	});
};

export const getTournamentByName = (name) => TournamentModel.findOne({ name });

export const getTournamentById = (id) => TournamentModel.findById(id);

export const create = (tournament) => TournamentModel(tournament).save();

export const getAllTeams = (id) => TournamentModel.distinct("teams", { _id: id });
