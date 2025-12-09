import MatchModel from "../models/match.js";

export const getAllMatches = (tournamentId) => MatchModel.find({ tournament: tournamentId });

export const createMatch = (tournamentId, match) => MatchModel.save({ ...match, tournament: tournamentId });