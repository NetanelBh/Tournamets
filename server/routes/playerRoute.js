import express from "express";
import * as playerServices from "../services/playerServices.js";

const router = express.Router();

// Entry point: localhost:3000/player 

router.post("/create", async (req, res) => {
    const {players} = req.body;

    try {
        const updatedPlayers = await playerServices.createPlayer(players);
        res.send({ status: true, data: updatedPlayers });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה ביצירת השחקנים, אנא נסה שנית" });
    }
});

export default router;