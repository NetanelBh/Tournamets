import express from "express";
import * as tournamentServices from "../services/tournamentServices.js";
import fetchFixtures from "../utils/fixturesFromWiki.js";

import israelToUTC from "../utils/ConvertIsraelTimeToUtc.js";
import { getUserbyId, addTournamentToUser } from "../services/userServices.js";
import findUnpaidUsers from "../utils/findUnpaidUsers.js";

const router = express.Router();

// Entry point: localhost:3000/tournament

router.get("/getAll", async (req, res) => {
	try {
		const tournaments = await tournamentServices.getAllTournaments();
		res.send({ status: true, data: tournaments });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת המידע, אנא נסה שנית" });
	}
});

router.post("/create", async (req, res) => {
	try {
		const { name, startDate, endDate, startTime, isTopScorerIncluded, imgUrl } = req.body;

		// Get the fixtures from wikipedia (translated to hebrew)
		const fixtures = await fetchFixtures(name);
		console.log("fixtures", fixtures);	
		
		// // Remove the _ from the original name to store in DB(the name with _ just to fetch data from wikipedia)
		// const dbName = name.replace(/_/g, " ");

		// const isTournamentExist = await tournamentServices.getTournamentByName(dbName);
		// if (isTournamentExist) {
		// 	res.send({ status: false, data: "הטורניר כבר קיים" });
		// 	return;
		// }

		// // Should convert the date entered to DATE object as UTC
		// const utcDate = israelToUTC(startDate, startTime);

		// // Get the fixtures from wikipedia (translated to hebrew)
		// const fixtures = await fetchFixtures(name);

		// // From the fixtures, extract the teams(with set to avoid duplicates)
		// const teams = new Set();
		// for (const fixture of fixtures) {
		// 	teams.add(fixture.home);
		// 	teams.add(fixture.away);
		// }

		// // Convert the set to array to insert the DB
		// const teamsArray = Array.from(teams);

		// 
		res.send({ status: true, data: "הדגמה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת הטורניר, אנא נסה שנית" });
	}
});

// Add tournament to user.tournaments
router.post("/join", async (req, res) => {
	try {
		const { tournamentId } = req.body;

		// Get the user from DB(he exists because he is logged in)
		const user = await getUserbyId(req.user.id);

		// Update the tournament in the user.tournaments
		const updatedUser = await addTournamentToUser(user.username, tournamentId);

		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת הטורניר, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "הטורניר התווסף בהצלחה לרשימת הטורנירים שלך" });
	} catch (error) {
		// res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
		res.send({ status: false, data: error.message });
	}
});

// Get the tournament's teams by the tournament id
router.get("/teams/:id", async (req, res) => {
	try {
		const teams = await tournamentServices.getAllTeams(req.params.id);
		res.send({ status: true, data: teams });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בבקשת הקבוצות של הטורניר, אנא נסה שנית" });
	}
});

export default router;
