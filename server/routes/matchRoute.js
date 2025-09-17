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

export default router;