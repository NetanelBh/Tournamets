import schedule from "node-schedule";
import {removeUserBets} from "../services/userServices.js";
import * as tournamentRepo from "../repos/tournamentRepo.js";
import { removeGroupFromUnpaidUsers } from "../repos/userRepo.js";
import { removeUnpaidUsers, getGroupsByFilter } from "../repos/groupRepo.js";
import { removeWinnerTeamPrediction } from "../services/winnerTeamPredictServices.js";
import { removeTopScorerPrediction } from "../services/topScorerPredictServices.js";

const scheduleTournamentJob = async (tournamentId) => {
	const tournamentData = await tournamentRepo.getTournamentById(tournamentId);
	if (!tournamentData) return;

	// If start time is in the past, skip
	if (tournamentData.startTime <= new Date().toISOString()) return;

	const jobName = `tournament-${tournamentId}`;

	// 🔁 prevent duplicate jobs
	if (schedule.scheduledJobs[jobName]) {
		schedule.scheduledJobs[jobName].cancel();
	}

	schedule.scheduleJob(jobName, tournamentData.startTime, async () => {
		try {
			const mustPaidGroups = await getGroupsByFilter(
				{
					tournament: tournamentId,
					isPaid: true,
				},
				{ members: 1 }
			);

			// For each must-paid group, check if each user has paid
			for (const group of mustPaidGroups) {
				// Get the unpaid ids from the group
				const unpaidUserIds = group.members.filter((member) => !member.hasPaid).map((m) => m.id);

				// If there are no unpaid users, continue
				if (!unpaidUserIds.length) continue;

				// Remove the unpaid users from the group(use the property of hasPaid: false)
				await removeUnpaidUsers(group._id);

				// Remove the group from the user's groups list
				await removeGroupFromUnpaidUsers(group._id, unpaidUserIds);

				// Remove the user matches bets for this group
				await removeUserBets(unpaidUserIds, tournamentId, group._id);

				// Remove the winnerTeam(if the user bet)
				await removeWinnerTeamPrediction(unpaidUserIds, tournamentId, group._id);

				// Remove the topScorer(if the user bet) and if the tournament defined with topScorer
				if(tournamentData.topScorerBet){
					await removeTopScorerPrediction(unpaidUserIds, tournamentId, group._id);
				}
			}
		} catch (error) {
			console.log("Tournament job error:", error.message);
		}
	});
};

export default scheduleTournamentJob;
