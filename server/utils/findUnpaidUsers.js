import schedule from "node-schedule";
import * as tournamentRepo from "../repos/tournamentRepo.js";
import { removeUnpaidUsers, getGroupsByFilter } from "../repos/groupRepo.js";
import { removeGroupFromUnpaidUsers } from "../repos/userRepo.js";

const scheduleTournamentJob = async (tournamentId) => {
	const tournamentData = await tournamentRepo.getTournamentById(tournamentId);

	// If start time is in the past, skip
	if (tournamentData.startTime <= new Date().toISOString()) return;

	schedule.scheduleJob(tournamentData.startTime, async () => {
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
			}
		} catch (error) {
			console.log(error.message);
		}
	});
};

export default scheduleTournamentJob;
