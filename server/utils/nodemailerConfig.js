// import nodemailer from "nodemailer";
import sgmail from "@sendgrid/mail";

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
