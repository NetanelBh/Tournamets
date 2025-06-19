import express from "express";
import bcrypt from "bcrypt";

import * as userServices from "../services/userServices.js";
import { isExist, getGroupByFilter, addGroupMember, leaveGroup } from "../services/groupServices.js";

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
			res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "המשתמש יצא מהטורניר בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהטורניר, אנא נסה שנית" });
	}
});

// get user's groups
router.get("/myGroups", async (req, res) => {
	try {
		// Get the user from the DB
		const userGroups = await userServices.getUserbyId(req.user.id).populate("groups");
		res.send({ status: true, data: userGroups.groups });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בהוספת הטורניר, אנא נסה שנית" });
	}
});

router.post("/joinGroup", async (req, res) => {
	try {
		const { groupName, code, tournamentId } = req.body;

		// Check if the group is exist in DB
		const isExistGroup = await isExist({ name: groupName });
		if (!isExistGroup) {
			res.send({ status: false, data: "הקבוצה לא קיימת, אנא הזן שם קבוצה קיימת" });
			return;
		}

		// Get the group that match the current tournament(maybe there is more group with same name in other tournament)
		const group = await getGroupByFilter({ name: groupName, tournament: tournamentId });
		if (!group) {
			res.send({ status: false, data: "הקבוצה לא קיימת בטורניר זה, אנא הזן שם קבוצה שקיימת בטורניר זה" });
			return;
		}

		const isMatch = await bcrypt.compare(code, group.code);
		if (!isMatch) {
			res.send({ status: false, data: "קוד הקבוצה שגוי" });
			return;
		}

		// Get the user from DB(he exists because he is logged in)
		const user = await userServices.getUserbyId(req.user.id);

		// Add the group to the user groups array
		const updatedUser = await userServices.addGroupToUser(user._id, group._id);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת הקבוצה הנוכחית למשתמש" });
			return;
		}
		// The insertion with $set to prevent duplicates, if after insertion is the same lenght, he is already inside
		if (updatedUser.groups.length === user.groups.length) {
			res.send({ status: false, data: "אתה קיים כבר בתוך הקבוצה" });
			return;
		}

		// Add the user to the group
		const updatedGroup = await addGroupMember(group._id, user._id);
		if (!updatedGroup) {
			res.send({ status: false, data: "אירעה בעיה בהוספת המשתמש לקבוצה הנוכחית" });
			return;
		}

		res.send({ status: true, data: "המשתמש הצטרף לקבוצה בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: error.message });
		// res.send({ status: false, data: "אירעה שגיאה בהצטרפות לקבוצה, אנא נסה שנית" });
	}
});

router.delete("/leaveGroup/:id", async (req, res) => {
	try {
		const groupId = req.params.id;
		
		// Remove the user from the group's members list
		const updatedGroup = await leaveGroup(req.user.id, groupId);
		if (!updatedGroup) {
			res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהקבוצה, אנא נסה שנית" });
			return;
		}
		
		// Remove the group from the user's groups list
		const updatedUser = await userServices.leaveGroup(req.user.id, groupId);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהקבוצה, אנא נסה שנית" });
			return;
		}

		res.send({ status: true, data: "המשתמש יצא מהקבוצה בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה במהלך יציאה מהקבוצה, אנא נסה שנית" });
	}
});

export default router;
