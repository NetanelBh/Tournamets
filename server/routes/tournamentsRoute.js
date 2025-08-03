import express from "express";
import * as tournamentServices from "../services/tournamentServices.js";

import israelToUTC from "../utils/ConvertIsraelTimeToUtc.js";
import {getImageFromWikipediaApi} from "../utils/getFromWikipediaUtils.js";

import {getUserbyId, addTournamentToUser} from "../services/userServices.js";

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
		const { name, startDate, endDate, startTime, isTopScorerIncluded } = req.body;
		
		// First get the tournament image from wikipedia with the wikipedia tournament source name(with _)
		const img = await getImageFromWikipediaApi(name);		
		
		// Remove the _ from the tournament name
		const newName = name.replace(/_/g, " ");	
		
		const isTournamentExist = await tournamentServices.getTournamentByName(newName);
		if (isTournamentExist) {
			res.send({ status: false, data: "הטורניר כבר קיים" });
			return;
		}

		// Should convert the date entered to DATE object as UTC
		const utcDate = israelToUTC(startDate, startTime);

		// TODO: WHEN CREATE THE TOURNAMENT, ALSO FETCH THE MATCHES FROM FREE API AND STORE IT IN THE DB(FIND FREE API)
		const teams = ["a", "b", "c", "d"];
		
		// Create the tournament
		const tournament = await tournamentServices.create(newName, endDate, utcDate, img, isTopScorerIncluded, teams);
		
		if (!tournament) {
			res.send({ status: false, data: "טורניר לא נוצר, אנא נסה שנית" });
			return;
		}
		res.send({ status: true, data: tournament });
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
router.get('/teams/:id', async (req, res) => {
	try {
		const teams = await tournamentServices.getAllTeams(req.params.id);
		res.send({status: true, data: teams});
	} catch (error) {
		res.send({status: false, data: "אירעה שגיאה בבקשת הקבוצות של הטורניר, אנא נסה שנית"})
	}
})

export default router;
