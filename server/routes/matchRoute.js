import express from "express";
import * as matchServices from "../services/matchServices.js";

const router = express.Router();

router.post("/getAll", async (req, res) => {
    const { tournamentId } = req.body;
    try {
        const matches = await matchServices.getAllMatches(tournamentId);
        if(!matches) {
            res.send({ status: false, data: "אירעה בעיה בקבלת המשחקים, אנא נסה שנית" });
            return;
        }
        res.send({ status: true, data: matches });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בקבלת המשחקים, אנא נסה שנית" });
    }
});

router.post("/create", async (req, res) => {
    const { tournamentId, match } = req.body;
    try {
        const newMatch = await matchServices.createMatch(tournamentId, match);
        if(!newMatch) {
            res.send({ status: false, data: "אירעה בעיה ביצירת המשחק, אנא נסה שנית" });
            return;
        }
        res.send({ status: true, data: newMatch });
    } catch (error) {
        res.send({ status: false, data: "אירעה שגיאה ביצירת המשחק, אנא נסה שנית" });
    }
});

export default router;