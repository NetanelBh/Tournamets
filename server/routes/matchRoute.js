import express from "express";
import * as matchServices from "../services/matchServices.js";

const router = express.Router();

// Entry point: localhost:3000/match

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
    const { match } = req.body;
    
    try {
        const newMatch = await matchServices.createMatch(match);
        if(!newMatch) {
            res.send({ status: false, data: "אירעה בעיה ביצירת המשחק, אנא נסה שנית" });
            return;
        }
        res.send({ status: true, data: newMatch });
    } catch (error) {
        res.send({ status: false, data: "אירעה שגיאה ביצירת המשחק, אנא נסה שנית" });
    }
});

router.patch("/update/:id", async (req, res) => {    
    try {        
        const updatedMatch = await matchServices.updateMatch(req.params.id, req.body);        
        if(!updatedMatch) {
            res.send({ status: false, data: "אירעה בעיה בעדכון המשחק, אנא נסה שנית" });
            return;
        }
        res.send({ status: true, data: updatedMatch });
    } catch (error) {
        res.send({ status: false, data: error.message });
    }
});

export default router;