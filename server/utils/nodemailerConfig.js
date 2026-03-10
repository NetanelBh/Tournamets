import nodemailer from "nodemailer";

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465, // SSL port
	secure: true, // true for 465
	auth: {
		user: process.env.MY_EMAIL, // your Gmail address
		pass: process.env.GMAIL_APP_PASSWORD, // your 16-char App Password
	},
});

const sendEmail = async (to, subject, html) => {
	const mailOptions = {
		from: process.env.MY_EMAIL,
		to,
		subject,
		html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: " + info.response);
		return info;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
};

export default sendEmail;
