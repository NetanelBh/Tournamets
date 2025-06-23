import * as topScorerRepo from "../repositories/topScorerRepo.js";

export const createTopScorer = (tournamentId, groupId, playereId, userId) => {
	const topScorer = { userId, tournamentId, groupId, playereId };
	return topScorerRepo.createTopScorer(topScorer);
};
