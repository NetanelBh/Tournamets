import * as betRepo from "../repos/betRepo.js";

export const getBetsByUser = (userId, tournamentId, groupId) => betRepo.getBetsByUser(userId, tournamentId, groupId); 