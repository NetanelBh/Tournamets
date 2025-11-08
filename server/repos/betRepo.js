import BetModel from "../models/bet.js";

export const getBetsByUser = (userId, tournamentId, groupId) => BetModel.find({ userId, tournamentId, groupId });

export const placeBets = (bets) => BetModel.bulkWrite(bets);

export const getUsersBetsByGroup = (tournamentId, groupId) => BetModel.find({ tournamentId, groupId });