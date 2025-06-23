import express from "express";
import * as topScorerServices from "../services/topScorerServices.js";

const router = express.Router();

// Entry point: localhost:3000/topScorer

router.post('/create', async (req, res) => {
    try {
        const {tournamentId, groupId, playereId} = req.body;
        const topScorer = await topScorerServices.createTopScorer(tournamentId, groupId, playereId, req.user.id);
        res.send({status: true, data: topScorer});
    } catch (error) {
        res.send({status: false, data: "אירעה שגיאה בבחירת מלך השערים של הטורניר, אנא נסה שנית"});
    }
});

router.get('/:id', async (req, res) => {
    // TODO: GET THE CORRESPONDING TOP PLAYER TO THE RIGHT ROUTNAMENT AND GROUP
});

export default router;