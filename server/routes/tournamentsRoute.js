import express from "express";
import axios from "axios";
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

		const isTournamentExist = await tournamentServices.getTournamentByName(name);
		if (isTournamentExist) {
			res.send({ status: false, data: "הטורניר כבר קיים" });
			return;
		}

		let tournamentImg = null;

		// Use wikipedia api to get the tournament symbol automatically.
		let imageParams = {
			action: "query",
			titles: name,
			prop: "pageimages",
			format: "json",
			pithumbsize: 500,
		};
		const resp = await getImageFromWikipediaApi(imageParams);
		if (resp) {
			const pages = resp.data.query.pages;
			const firstPage = Object.values(pages)[0];
			tournamentImg = firstPage?.thumbnail?.source;
		}

		// If the image is not found, use a default image
		if (!tournamentImg) {
			imageParams = { action: "query", titles: name, prop: "pageprops", format: "json" };
			const wikidataIdResponse = await getImageFromWikipediaApi(imageParams);
			const pages = wikidataIdResponse.data.query.pages;
			const page = Object.values(pages)[0];
			const wikidataId = page?.pageprops?.wikibase_item;

			if (!wikidataId) throw new Error("Wikidata ID not found");

			const wikidataResponse = await axios.get(
				`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`
			);

			const entity = wikidataResponse.data.entities[wikidataId];
			const logoFilename = entity?.claims?.P154?.[0]?.mainsnak?.datavalue?.value;

			if (!logoFilename) throw new Error("Logo not found in Wikidata");

			tournamentImg = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(logoFilename)}`;
		}

		// Should convert the date entered to DATE object as UTC
		const utcDate = israelToUTC(startDate, startTime);

		// Create the tournament
		const tournament = await tournamentServices.createTournament(name, startDate, endDate, utcDate, tournamentImg);
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
