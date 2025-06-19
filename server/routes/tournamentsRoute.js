import express from "express";
import * as tournamentServices from "../services/tournamentServices.js";

import israelToUTC from "../utils/ConvertIsraelTimeToUtc.js";
import getImageFromWikipediaApi from "../utils/getTournamentImage.js";

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
		const { name, startDate, endDate, startTime } = req.body;

		// First get the tournament image from wikipedia with the wikipedia tournament source name(with _)
		const tournamentImg = await getImageFromWikipediaApi(name);
		
		// Remove the _ from the tournament name
		const officialName = name.replace(/_/g, " ");	
		
		const isTournamentExist = await tournamentServices.getTournamentByName(officialName);
		if (isTournamentExist) {
			res.send({ status: false, data: "הטורניר כבר קיים" });
			return;
		}

		// Should convert the date entered to DATE object as UTC
		const utcDate = israelToUTC(startDate, startTime);

		// Create the tournament
		const tournament = await tournamentServices.create(officialName, startDate, endDate, utcDate, tournamentImg);
		if (!tournament) {
			res.send({ status: false, data: "קבוצה לא נוצרה, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "הטורניר נוצר בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת הטורניר, אנא נסה שנית" });
	}
});

export default router;
