// import nodemailer from "nodemailer";
import sgmail from "@sendgrid/mail";

// const transporter = nodemailer.createTransport({
// 	host: "smtp.gmail.com",
// 	port: 465,
// 	secure: true,
// 	authMethod: "PLAIN",
// 	auth: {
// 		user: process.env.SENDGRID_EMAIL,
// 		pass: process.env.GMAIL_APP_PASSWORD,
// 	},
// 	connectionTimeout: 10000, // 10 seconds
// 	greetingTimeout: 10000,
// 	socketTimeout: 10000,
// });

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async(to, subject, text) => {
	try {
		await sgmail.send({
			to,
			from: process.env.MY_EMAIL,
			subject,
			text,	
		})
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export default sendEmail;
