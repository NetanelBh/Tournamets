import * as userServices from "../services/userServices.js";

import express from "express";
const router = express.Router();

// Entry point: localhost:3000/user

// Get all tourmanents that the user is in
router.get("/myTournaments", async (req, res) => {
	try {
		// Get the user from the DB
		const user = await userServices.getUserbyId(req.user.id);
		if (!user) {
			res.send({ status: false, data: "משתמש לא קיים במערכת" });
			return;
		}

		// Get the user tournaments
		const tournaments = await userServices.getUserTournaments(user.tournaments);
		if (!tournaments) {
			res.send({ status: false, data: "אין טורנירים זמינים עבור המשתמש" });
			return;
		}

		res.send({ status: true, data: tournaments });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת המידע, אנא נסה שנית" });
	}
});

// Add tournament to user.tournaments
router.post("/addTournament", async (req, res) => {
	try {
		const { tournamentId } = req.body;
		const user = await userServices.getUserbyId(req.user.id);
		if (!user) {
			res.send({ status: false, data: "משתמש לא קיים במערכת" });
			return;
		}

		const updatedUser = await userServices.addTournamentToUser(user.username, tournamentId);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת הטורניר, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "הטורניר התווסף בהצלחה לרשימת הטורנירים שלך" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
	}
});

// get user's groups
router.get("/myGroups", async (req, res) => {
	try {
		// Get the user from the DB
		const userGroups = await userServices.getUserbyId(req.user.id).populate("groups");
		if (!userGroups) {
			res.send({ status: false, data: "המשתמש לא רשום לאף קבוצה" });
			return;
		}

		console.log(userGroups.groups);
		
		res.send({ status: true, data: userGroups.groups });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
	}
});

export default router;
