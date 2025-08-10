import express from "express";
import * as topScorerPredictServices from "../services/topScorerPredictServices.js";

const router = express.Router();

// Entry point: localhost:3000/topScorerBet

router.get("/getUserPredict", async (req, res) => {
	const { tournamentId, groupId } = req.body;

	try {
		const userPredict = await topScorerPredictServices.getUserPredict(req.user.id, tournamentId, groupId);
		res.send({ status: true, data: userPredict });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת הניחוש הנכון, אנא נסה שנית" });
	}
});

router.post("/createPredict", async (req, res) => {
	const { tournamentId, groupId, topScorerId } = req.body;

	try {
		const userPredict = await topScorerPredictServices.createPredict(
			req.user.id,
			tournamentId,
			groupId,
			topScorerId
		);
		res.send({ status: true, data: userPredict });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת הניחוש, אנא נסה שנית" });
	}
});

// As long as the tournament didn't start, the user can change the predict
router.patch("/updatePredict", async (req, res) => {
    const { tournamentId, groupId, topScorerId } = req.body;

    try {
        const userPredict = await topScorerPredictServices.updatePredict(
            req.user.id,
            tournamentId,
            groupId,
            topScorerId,
        );
        res.send({ status: true, data: userPredict });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בעדכון הניחוש, אנא נסה שנית" });
    }
});

export default router;
