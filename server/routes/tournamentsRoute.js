import express from "express";
import * as tournamentServices from "../services/tournamentServices.js";

const router = express.Router();

// Entry point: localhost:3000/tournaments

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
        const { name, startDate, endDate } = req.body;

        const isTournamentExist = await tournamentServices.isTournamentExist(name);
        if (isTournamentExist) {
            res.send({ status: false, data: "הטורניר כבר קיים" });
            return;
        }

        const tournament = await tournamentServices.createTournament(name, startDate, endDate);
        if (tournament) {
            res.send({ status: true, data: "הטורניר נוצר בהצלחה" });
        } else {
            res.send({ status: false, data: "אירעה בעיה ביצירת הטורניר, אנא נסה שנית" });
        }
    } catch (error) {
        res.send({status: false, data: "אירעה בעיה ביצירת הטורניר, אנא נסה שנית"});
    }
})