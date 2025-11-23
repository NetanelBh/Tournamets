import express from "express";
import { getTopScorerPredict } from "../services/topScorerPredictServices.js";
import { getTeamPredict } from "../services/winnerTeamPredictServices.js";
import * as betServices from "../services/betServices.js";

const router = express.Router();

// Entry point: localhost:3000/bets

router.post("/get", async (req, res) => {
	const { tournamentId, groupId } = req.body;
	try {
		const topScorerPrediction = await getTopScorerPredict(req.user.id, tournamentId, groupId).populate("topScorer");
		const teamPrediction = await getTeamPredict(req.user.id, tournamentId, groupId).populate("winnerTeam");
		const userBets = await betServices.getBetsByUser(req.user.id, tournamentId, groupId).select("-_id");
		res.send({
			status: true,
			data: {
				topScorer: topScorerPrediction ? topScorerPrediction.topScorer.name : null,
				winnerTeam: teamPrediction ? teamPrediction.winnerTeam : null,
				userBets,
			},
		});
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת הימורי המשתמש" });
	}
});

router.put("/placeBets", async (req, res) => {
	const { bets } = req.body;

	try {
		const resp = await betServices.placeBets(bets);
		res.send({ status: true, data: resp.modifiedCount + resp.upsertedCount });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בקבלת תוצאות המשתמשים" });
	}
});

router.post("/allUsersBets", async (req, res) => {
	const { tournamentId, groupId } = req.body;

	try {
		const usersBets = await betServices
			.getUsersBetsByGroup(tournamentId, groupId)
			.select("-_id -tournamentId -groupId");		
		res.send({ status: true, data: usersBets });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בקבלת תוצאות המשתמשים" });
	}
});

router.post("/specificMatchUsersBets", async (req, res) => {
	const { tournamentId, groupId, matchId } = req.body;

	try {
		const usersBets = await betServices
			.getUsersBetsByMatch(tournamentId, groupId, matchId)
			.select("-_id -tournamentId -groupId");
		res.send({ status: true, data: usersBets });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בקבלת תוצאות המשתמשים" });
	}
});

export default router;
