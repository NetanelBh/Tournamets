import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserbyUsername, createUser, getUserByEmail, updateUser } from "../services/userServices.js";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const isTokenExist = req.headers.authorization;
	
	try {
		const user = await getUserbyUsername(username);
		if (!user.isVerified) {
			res.send({ status: false, data: "יש לאמת תחילה את כתובת המייל בלינק שנשלח אליך" });
			return;
		}

		if (!user) {
			res.send({ status: false, data: "שם משתמש לא קיים" });
			return;
		}

		// If the token exist, it means the user is logged in already
		if(isTokenExist) {
			res.send({status: false, data: "המשתמש כבר מחובר"});
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.send({ status: false, data: "סיסמא שגויה" });
			return;
		}

		const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "4h" });
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

router.post("/register", async (req, res) => {
	const userData = req.body;

	try {
		// Check if user is exist already
		const user = await getUserbyUsername(userData.username);
		if (user) {
			res.send({ status: false, data: "שם משתמש קיים, אנא בחר שם אחר" });
			return;
		}

		// Check if the email exist already
		const email = await getUserByEmail(userData.email);
		if (email) {
			res.send({ status: false, data: "דואר אלקטרוני קיים כבר במערכת" });
			return;
		}

		const createdUser = await createUser(userData);
		if (!createdUser) {
			res.send({ status: false, data: "אירעה בעיה ביצירת המשתמש" });
			return;
		}

		const token = jwt.sign({ username: createdUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
		const url = `${process.env.REACT_ADDRESS}/verify/${token}`;
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: createdUser.email,
			subject: "Verify your email",
			html: `<p>Please click the link to verify your email:</p><a href="${url}">${url}</a>`,
		});

		res.send({ status: true, data: "נא לאמת את המשתמש באמצעות המייל שנשלח אליך" });
	} catch (error) {
		res.send({ status: false, data: "אירעה בעיה ביצירת המשתמש" });
	}
});

router.get("/verify/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await getUserbyUsername(decode.username);
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

router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			res.send({ status: false, data: "משתמש לא קיים במערכת" });
			return;
		}

		const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
		const url = `${process.env.REACT_ADDRESS}/reset-password/${token}`;
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Reset your password",
			html: `<p>Click the link below to reset your password:</p><a href="${url}">${url}</a>`,
		});

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
		const user = await getUserbyUsername(decode.username);
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

		res.send({ status: true, data: "סיסמה שונתה בהצלחה" });
	} catch {
		res.send({ status: false, data: "בעיה בעדכון הסיסמה, אנא נסה שנית" });
	}
});

export default router;
