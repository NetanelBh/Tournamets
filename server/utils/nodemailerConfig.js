import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	authMethod: "PLAIN",
	auth: {
		user: process.env.MY_GMAIL,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
	connectionTimeout: 10000, // 10 seconds
	greetingTimeout: 10000,
	socketTimeout: 10000,
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
