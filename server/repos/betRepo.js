import BetModel from "../models/bet.js";

export const getBetsByUser = (userId, tournamentId, groupId) => BetModel.find({ userId, tournamentId, groupId });

export const placeBets = (filters, bet) => findOneAndUpdate(filters, bet, { upsert: true, new: true });

export const getUsersBetsByGroup = (tournamentId, groupId) => BetModel.find({ tournamentId, groupId });

// remove the user bets by tournamentId and groupId
export const removeBets = (userId, tournamentId, groupId) => BetModel.deleteMany({ userId, tournamentId, groupId });

// Remove the user bets by tournamentId(if clicked leave tournament, remove all his bets that belongs to the tournament)
export const removeUserTournamentBets = (userId, tournamentId) => BetModel.deleteMany({ userId, tournamentId });