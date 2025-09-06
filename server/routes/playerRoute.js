import express from "express";
import * as playerServices from "../services/playerServices.js";
import {getTournamentById} from "../services/tournamentServices.js";

const router = express.Router();

// Entry point: localhost:3000/player 

router.post("/get", async (req, res) => {
    // By the tournamet id we can fetch the players with populate(players are refereced to the tournaments collection)
    const {tournamentId} = req.body;
    
    try {
        const tournament = await getTournamentById(tournamentId).populate("players");        
        if(!tournament) {
            res.send({ status: false, data: "אירעה בעיה בקבלת השחקנים, אנא נסה שנית" });
            return;
        }
        
        res.send({ status: true, data: tournament.players });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה בקבלת השחקנים, אנא נסה שנית" });
    }
})

router.post("/create", async (req, res) => {
    const {players} = req.body;

    try {
        const updatedPlayers = await playerServices.createPlayer(players);
        if (!updatedPlayers) {
            res.send({ status: false, data: "אירעה בעיה ביצירת השחקנים, אנא נסה שנית" });
            return;
        }
        res.send({ status: true, data: updatedPlayers });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה ביצירת השחקנים, אנא נסה שנית" });
    }
});

export default router;