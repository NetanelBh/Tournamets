import express from "express";
import * as teamServices from "../services/teamServices.js";

const router = express.Router();

// Entry point: localhost:3000/team

router.post("/createCollection", async (req, res) => {
    const {teams} = req.body;

    try {
        const updatedPlayers = await teamServices.createPlayersCollection(teams);
        res.send({ status: true, data: updatedPlayers });
    } catch (error) {
        res.send({ status: false, data: "אירעה בעיה ביצירת השחקנים, אנא נסה שנית" });
    }
});

export default router;