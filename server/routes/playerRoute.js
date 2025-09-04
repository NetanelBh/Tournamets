import express from "express";
import * as playerServices from "../services/playerServices.js";

const router = express.Router();

// Entry point: localhost:3000/player 

// TODO: GET THE PLAYERS FROM THE DB
router.get("/get", async (req, res) => {
    try {
        
    } catch (error) {
        
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