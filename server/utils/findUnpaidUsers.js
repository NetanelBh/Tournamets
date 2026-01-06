import schedule from "node-schedule";
import * as tournamentRepo from "../repos/tournamentRepo.js";
import * as groupRepo from "../repos/groupRepo.js";
import {leaveGroup} from "../repos/userRepo.js";

const scheduleTournamentJob = async (tournamentId) => {
	const tournamentData = await tournamentRepo.getTournamentById(tournamentId);    
    
	// If start time is in the past, skip
	if (tournamentData.startTime <= new Date().toISOString()) return;

	schedule.scheduleJob(tournamentData.startTime, async () => {      
		// Find all must-paid groups
		const mustPaidGroups = await groupRepo
			.getGroupsByFilter({
				tournament: tournamentData._id,
				isPaid: true,
			})
			.select("members")
			.lean();
        
        // For each must-paid group, check if each user has paid
		for (const group of mustPaidGroups) {
			for (const member of group.members) {                
				if (!member.hasPaid) {                    
                    // Remove the user from the groups collection
					await groupRepo.leaveGroup(member.id, group._id );
                    // Remove the group from the user's groups list
					// TODO: CHECK THE LOG THEN REMOVE IT AND THE DATA VARIABLE
                    const data = await leaveGroup(member.id, group._id);
					console.log(data);
					
				}
			}
		}
	});
};

export default scheduleTournamentJob;
