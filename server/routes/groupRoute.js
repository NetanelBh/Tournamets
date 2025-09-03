import express from "express";
import * as userServices from "../services/userServices.js";
import * as groupServices from "../services/groupServices.js";
import { addGroupToUser } from "../services/userServices.js";

const router = express.Router();

// Entry point: localhost:3000/group

router.post("/create", async (req, res) => {
	const data = {...req.body, userId: req.user.id};
	console.log(data.points.knockoutStage.differentPoints);
	
	try {
		// First check if the group exist
		const isGroupExist = await groupServices.getGroupByFilter({ name: data.name, tournament: data.tournamentId });
		if (isGroupExist) {
			res.send({ status: false, data: "שם הקבוצה קיים, אנא בחר שם אחר" });
			return;
		}

		const group = await groupServices.createGroup(data);
		if(!group) {
			res.send({ status: false, data: "אירעה בעיה ביצירת הקבוצה בבסיס הנתונים" });
			return;
		}

		const updatedUser = await addGroupToUser(data.userId, group._id);
		if(!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת הקבוצה הנוכחית למשתמש" });
			return;
		}

		res.send({ status: true, data: "הקבוצה נוצרה בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת הקבוצה" });
	}
});

router.post("/join", async (req, res) => {
	try {
		const { groupName, code, tournamentId } = req.body;

		// Get the group that match the current tournament(maybe there is more group with same name in other tournament)
		const group = await groupServices.getGroupByFilter({ name: groupName, tournament: tournamentId });
		if (!group) {
			res.send({ status: false, data: "הקבוצה לא קיימת בטורניר זה, אנא הזן שם קבוצה שקיימת בטורניר זה" });
			return;
		}

		const isMatch = await groupServices.getGroupCode(groupName, tournamentId);
		if (isMatch.code !== code) {
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
		const updatedGroup = await groupServices.addGroupMember(group._id, user._id);
		
		if (!updatedGroup) {
			res.send({ status: false, data: "אירעה בעיה בהוספת המשתמש לקבוצה הנוכחית" });
			return;
		}

		res.send({ status: true, data: updatedGroup._id });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה בהצטרפות לקבוצה, אנא נסה שנית" });
	}
});

export default router;
