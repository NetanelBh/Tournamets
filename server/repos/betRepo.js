import BetModel from "../models/bet.js";

export const getBetsByUser = (userId, tournamentId, groupId) => BetModel.find({ userId, tournamentId, groupId });

export const placeBets = (bets) => BetModel.bulkWrite(bets);

export const getUsersBetsByGroup = (tournamentId, groupId) => BetModel.find({ tournamentId, groupId });

// remove the user bets by tournamentId and groupId
export const removeBets = (userId, tournamentId, groupId) => BetModel.deleteMany({ userId, tournamentId, groupId });

export const removeUserTournamentBets = (userId, tournamentId) => BetModel.deleteMany({ userId, tournamentId });