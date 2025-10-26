import * as betRepo from "../repos/betRepo.js";

export const getBetsByUser = (userId, tournamentId, groupId) => betRepo.getBetsByUser(userId, tournamentId, groupId); 

export const placeBets = (bets) => {
    const bulkOps = bets.map((bet) => ({
        updateOne: {
            filter: { userId: bet.userId, tournamentId: bet.tournamentId, groupId: bet.groupId, matchId: bet.matchId },
            update: { $set: { betScore: bet.betScore } },
            upsert: true
        }
    }))
    
    return betRepo.placeBets(bulkOps);
}