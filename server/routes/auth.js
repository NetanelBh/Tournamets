import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/nodemailerConfig.js";

import { getUserbyId, getUserbyUsername, createUser, getUserByEmail, updateUser } from "../services/userServices.js";

const router = express.Router();

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await getUserByEmail(email);
		if (!user) {
			res.send({ status: false, data: "המשתמש לא רשום במערכת" });
			return;
		}

		if (user.email !== email) {
			res.send({ status: false, data: "כתובת מייל שגויה, אנא נסה שנית" });
			return;
		}

		if (!user.isVerified) {
			res.send({ status: false, data: "יש לאמת תחילה את כתובת המייל בלינק שנשלח אליך" });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.send({ status: false, data: "סיסמא שגויה" });
			return;
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , { expiresIn: "10m" });

		// Get the full user's group to use it in frontend instead of send request each page browsing
		user = await user.populate("groups");
		const returnedUser = user.toObject();
		// Delete the password from the object
		delete returnedUser.password;
		// Add the token to the user
		returnedUser.token = token;

		res.send({ status: true, data: returnedUser });
	} catch (error) {
		res.send({ status: false, data: error.message });
	}
});

// Refresh token if the user is active in the website
router.post("/refresh", (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.sendStatus(401);
  
	const token = authHeader.split(" ")[1];
  
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
	  const newToken = jwt.sign(
		{ id: decoded.id },
		process.env.JWT_SECRET,
		{ expiresIn: "10m" }
	  );
  
	  res.send({ status: true, token: newToken });
	} catch {
	  res.sendStatus(401);
	}
  });
  

router.post("/register", async (req, res) => {
	const userData = req.body;

	try {
		const isUserExist = await getUserbyUsername(userData.username);
		// Check if user is exist already
		if (isUserExist) {
			res.send({ status: false, data: "משתמש קיים במערכת , אנא בחר שם אחר" });
			return;
		}

		// Check if the email exist already
		const isMailExist = await getUserByEmail(userData.email);
		if (isMailExist) {
			res.send({ status: false, data: "דואר אלקטרוני קיים כבר במערכת" });
			return;
		}

		const createdUser = await createUser(userData);
		if (!createdUser) {
			res.send({ status: false, data: "אירעה בעיה ביצירת המשתמש" });
			return;
		}

		const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
		const verificationLink = `${process.env.REACT_ADDRESS}/verify/${token}`;
		await sendEmail(
			createdUser.email,
			"אימות חשבון",
			`
			<p>כדי לאמת את החשבון שלך, לחץ על הקישור הבא</p>
			<a href="${verificationLink}" 
			style="
      			background-color: #28a745;
      			color: white;
      			padding: 12px 24px;
      			text-decoration: none;
      			border-radius: 6px;
      			display: inline-block;
      			font-size: 16px;
    		">אימות חשבון</a>
			`
		);
		res.send({ status: true, data: "נא לאמת את המשתמש באמצעות המייל שנשלח אליך (בדוק גם בתיבת הספאם)" });
	} catch (error) {
		res.send({ status: false, data: error.message });
	}
});

router.get("/verify/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await getUserbyId(decode.id);
		if (!user) {
			res.send({ status: false, data: "שם משתמש לא קיים" });
			return;
		}

		if (user.isVerified) {
			res.send({ status: false, data: "המשתמש כבר אומת" });
			return;
		}

		const updatedUser = await updateUser(user._id, { isVerified: true });
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בעדכון המשתמש" });
			return;
		}

		res.send({ status: true, data: "המשתמש אומת בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "שגיאת אימות" });
	}
});

// When user forgot the password, enter his mail and get link to reset the password
router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			res.send({ status: false, data: "משתמש לא קיים במערכת" });
			return;
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
		const url = `${process.env.REACT_ADDRESS}/reset-password/${token}`;
		await sendEmail(
			email,
			"איפוס סיסמא",
			`
			<p>לחץ על הקישור הבא כדי לאפס את הסיסמא שלך</p>
			<a href="${url}" style="
      			background-color: #28a745;
      			color: white;
      			padding: 12px 24px;
      			text-decoration: none;
      			border-radius: 6px;
      			display: inline-block;
      			font-size: 16px;
    		">איפוס סיסמה</a>
			`
		);

		res.send({ status: true, data: "מייל לאיפוס סיסמא נשלח בהצלחה" });
	} catch (error) {
		res.send({ status: false, data: "אירעה שגיאה, אנא נסה שנית" });
	}
});

router.post("/reset-password/:token", async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;
	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await getUserbyId(decode.id);
		if (!user) {
			res.send({ status: false, data: "שם משתמש לא קיים" });
			return;
		}

		user.password = await bcrypt.hash(newPassword, 10);
		const updatedUser = await updateUser(user._id, user);
		if (!updatedUser) {
			res.send({ status: false, data: "אירעה בעיה בעדכון הסיסמה" });
			return;
		}

		res.send({ status: true, data: "הסיסמה עודכנה בהצלחה" });
	} catch {
		res.send({ status: false, data: "בעיה בעדכון הסיסמה, אנא נסה שנית" });
	}
});

export default router;
