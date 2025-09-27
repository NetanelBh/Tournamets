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
		const userBets = await betServices.getBetsByUser(req.user.id, tournamentId, groupId).select("betScore matchId -_id");
		
		res.send({
			status: true,
			data: { topScorer: topScorerPrediction.topScorer.name, winnerTeam: teamPrediction.winnerTeam, userBets },
		});
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת הימורי המשתמש" });
	}
});

router.post("/save", async (req, res) => {
	const { tournamentId, groupId } = req.body;
});

export default router;
