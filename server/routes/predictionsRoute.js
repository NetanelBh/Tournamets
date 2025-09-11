import express from "express";
import { getTopScorerPredict } from "../services/topScorerPredictServices.js";
import { getTeamPredict } from "../services/winnerTeamPredictServices.js";

const router = express.Router();

// Entry point: localhost:3000/predictions

router.post("/", async (req, res) => {
	const { tournamentId, groupId } = req.body;
	try {
		const topScorerPrediction = await getTopScorerPredict(req.user.id, tournamentId, groupId).populate("topScorer");
		const teamPrediction = await getTeamPredict(req.user.id, tournamentId, groupId).populate("winnerTeam");

		res.send({
			status: true,
			data: { topScorer: topScorerPrediction.topScorer.name, winnerTeam: teamPrediction.winnerTeam },
		});
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת הימורי הקבוצה הזוכה ומלך השערים" });
	}
});

export default router;
