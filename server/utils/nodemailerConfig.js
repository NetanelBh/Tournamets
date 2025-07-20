import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MY_GMAIL,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

const sendEmail = (to, subject, html) => {
	try {
		const info = transporter.sendMail({
			from: process.env.MY_GMAIL,
			to,
			subject,
			html,
		});
		return info;
	} catch (error) {
		console.error("Error sending email:", err);
	}
};

export default sendEmail;