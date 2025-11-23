import express from "express";
import * as winnerTeamPredictServices from "../services/winnerTeamPredictServices.js";

const router = express.Router();

// Entry point: localhost:3000/winnerTeamBet

router.get("/getTeamPredict", async (req, res) => {
    const { tournamentId, groupId } = req.body;

    try {
        const userPredict = await winnerTeamPredictServices.getTeamPredict(req.user.id, tournamentId, groupId);
        if(!userPredict) {
            res.send({ status: false, data: "המשתמש עדיין לא הימר על הזוכה" });
            return;
        }   
        res.send({ status: true, data: userPredict });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בקבלת הניחוש הנכון, אנא נסה שנית" });
    }
});

router.post("/getAllByGroup", async (req, res) => {
    const { tournamentId, groupId } = req.body;
    try {
        const teamPredicts = await winnerTeamPredictServices.getAllByGroup(tournamentId, groupId);
        res.send({ status: true, data: teamPredicts });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בקבלת ניחוש הקבוצות הזוכות, אנא נסה שנית" });
    }
});

router.post("/createPredict", async (req, res) => {
    const { tournamentId, groupId, winnerTeamName } = req.body;

    try {
        const userPredict = await winnerTeamPredictServices.createPredict(
            req.user.id,
            tournamentId,
            groupId,
            winnerTeamName
        );
        res.send({ status: true, data: userPredict });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה ביצירת הניחוש, אנא נסה שנית" });
    }
});

// As long as the tournament didn't start, the user can change the predict
router.patch("/updatePredict", async (req, res) => {
    const { tournamentId, groupId, winnerTeamName } = req.body;

    try {
        const userPredict = await winnerTeamPredictServices.updatePredict(
            req.user.id,
            tournamentId,
            groupId,
            winnerTeamName,
        );
        res.send({ status: true, data: userPredict });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בעדכון הניחוש, אנא נסה שנית" });
    }
});

export default router;
