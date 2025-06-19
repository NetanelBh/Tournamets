import * as userServices from "../services/userServices.js";
import express from "express";

const router = express.Router();

// Entry point: localhost:3000/user

// Get the user's list of tournaments he is in 
router.get("/myTournaments", async (req, res) => {
	try {
		// Get the user's tournaments from the DB(with populate we get the entire tournament objects list)
		const userTournaments = await userServices.getUserbyId(req.user.id).populate("tournaments");

		res.send({ status: true, data: userTournaments.tournaments });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה בקבלת המידע, אנא נסה שנית" });
	}
});

// Add tournament to user.tournaments
router.post("/joinTournament", async (req, res) => {
	try {
		const { tournamentId } = req.body;

		// Get the user from DB(he exists because he is logged in)
		const user = await userServices.getUserbyId(req.user.id);
		
		// Update the tournament in the user.tournaments
		const updatedUser = await userServices.addTournamentToUser(user.username, tournamentId);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת הטורניר, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "הטורניר התווסף בהצלחה לרשימת הטורנירים שלך" });
	} catch (error) {
		// res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
		res.send({ status: false, data: error.message });
	}
});

router.delete("/leaveTournament/:id", async (req, res) => {
	try {
		const tournamentId = req.params.id;
		const updatedUser = await userServices.leaveTournament(req.user.id, tournamentId);
		if (!updatedUser) {
			res.send({status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית"})
			return;
		}
		
		res.send({status: true, data: "המשתמש יצא מהטורניר בהצלחה"})
	} catch (error) {
		res.send({status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית"})
	}
})

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
