import express from "express";
import * as groupServices from "../services/groupServices.js";
import { addGroupToUser } from "../services/userServices.js";

const router = express.Router();

// Entry point: localhost:3000/group

router.post("/create", async (req, res) => {
	// TODO: FINISH THE CREATE GROUP LOGIC



	const { name, code, tournamentId } = req.body;
	try {
		// First check if the group exist
		const isGroupExist = await groupServices.isExist({name});
		if (isGroupExist) {
			res.send({ status: false, data: "שם הקבוצה קיים, אנא בחר שם אחר" });
			return;
		}

		// Create the group
		const group = await groupServices.createGroup(name, code, req.user.id);
		if (group) {
			// Add the group to the user groups(for effieicency)
			const updatedUser = await addGroupToUser(req.user.id, group._id);
			if (updatedUser) {
				res.send({ status: true, data: "קבוצה נוצרה בהצלחה" });
			} else {
				res.send({ status: false, data: "אירעה בעיה בהוספת המשתמש לקבוצה הנוכחית" });
			}
		} else {
			res.send({ status: false, data: "אירעה בעיה ביצירת הקבוצה" });
		}
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת הקבוצה" });
	}
});

router.post("/join", async (req, res) => {
	const { code, groupName, userId } = req.body;
	try {
		// Check if the group exist in DB
		const group = await groupServices.isExist({name: groupName});
		if (!group) {
			res.send({ status: false, data: "הקבוצה לא קיימת, אנא הזן שם קבוצה קיימת" });
			return;
		}

		// Check the password
		if (group.code !== code) {
			res.send({ status: false, data: "קוד הקבוצה שגוי" });
			return;
		}

		// Add the group to the user groups(for effieicency)
		const updatedUser = await addGroupToUser(userId, group._id);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בהוספת המשתמש לקבוצה הנוכחית" });
			return;
		}

        // Add the user to the group
        const updatedGroup = await groupServices.addGroupMember(group._id, userId);
        if (!updatedGroup) {
            res.send({ status: false, data: "אירעה בעיה בהוספת המשתמש לקבוצה הנוכחית" });
            return;
        }

		res.send({ status: true, data: "התווספת לקבוצה בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה, אנא נסה להכנס לקבוצה שנית" });
	}
});

export default router;
