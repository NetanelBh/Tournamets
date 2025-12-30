import * as betRepo from "../repos/betRepo.js";

export const getBetsByUser = (userId, tournamentId, groupId) => betRepo.getBetsByUser(userId, tournamentId, groupId); 

export const placeBets = (tournamentId, groupId, userId, matchId, bet) => {
    const filters = { tournamentId, groupId, userId, matchId }; 
    
    return betRepo.placeBets(filters, bet)
};

export const getUsersBetsByGroup = (tournamentId, groupId) => betRepo.getUsersBetsByGroup(tournamentId, groupId);