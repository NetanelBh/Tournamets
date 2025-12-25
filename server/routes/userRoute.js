import express from "express";

import * as userServices from "../services/userServices.js";
import { leaveGroup } from "../services/groupServices.js";
import {getTournamentById} from "../services/tournamentServices.js";
import {removeWinnerTeamPrediction} from "../services/winnerTeamPredictServices.js";
import {removeTopScorerPrediction} from "../services/topScorerPredictServices.js";

const router = express.Router();

// Entry point: localhost:3000/user

router.post("/allUsers", async (req, res) => {
	const {tournamentId, groupId} = req.body;
	try {
		const users = await userServices.getAllUsers(tournamentId, groupId).select("-password");	
		res.send({ status: true, data: users });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת המשתמשים, אנא נסה שנית" });
	}
})
// Get the user's list of tournaments he is in
router.get("/myTournaments", async (req, res) => {
	try {
		// Get the user's tournaments from the DB(with populate we get the entire tournament objects list)
		const userTournaments = await userServices.getUserbyId(req.user.id).populate("tournaments");

		res.send({ status: true, data: userTournaments.tournaments });
	} catch (error) {
		// res.send({ status: false, data: "אירעה בעיה בקבלת המידע, אנא נסה שנית" });
		res.send({ status: false, data: error.message });
	}
});

router.delete("/leaveTournament/:id", async (req, res) => {
	try {
		const tournamentId = req.params.id;
		const updatedUser = await userServices.leaveTournament(req.user.id, tournamentId);		
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית" });
			return;
		}
		
		res.send({ status: true, data: "המשתמש יצא מהטורניר בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית" });
	}
});

// get user's groups
router.get("/myGroups", async (req, res) => {
	try {
		// Get the user from the DB
		const userGroups = await userServices.getUserbyId(req.user.id).populate("groups");
		res.send({ status: true, data: userGroups.groups });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
	}
});

router.post("/leaveGroup", async (req, res) => {
	try {
		const {tournamentId, groupId} = req.body;
		
		// Remove the user from the group's members list
		const updatedGroup = await leaveGroup(req.user.id, groupId);		
		if (!updatedGroup) {
			res.send({ status: false, data: "המשתמש לא הוסר מהקבוצה, אנא נסה שנית" });
			return;
		}
		
		// Remove the group from the user's groups list
		const updatedUser = await userServices.leaveGroup(req.user.id, groupId);
		if (!updatedUser) {
			res.send({ status: false, data: "הקבוצה לא הוסרה מהמשתמש, אנא נסה שנית" });
			return;
		}

		// Remove the user matches bets for this group
		await userServices.removeUserBets(req.user.id, tournamentId, groupId);

		// remove the winner team bet
		await removeWinnerTeamPrediction(req.user.id, tournamentId, groupId);

		// remove the top scorer bet if allowed in the tournament
		const tournament = await getTournamentById(tournamentId);
		if(tournament.topScorerBet) {
			await removeTopScorerPrediction(req.user.id, tournamentId, groupId);
		}

		res.send({ status: true, data: "המשתמש יצא מהקבוצה בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהקבוצה, אנא נסה שנית" });
	}
});

export default router;
