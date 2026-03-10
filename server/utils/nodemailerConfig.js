import axios from "axios";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async (to, subject, html) => {
	try {
		const response = await axios.post(
			BREVO_URL,
			{
				sender: {
					email: process.env.MY_EMAIL,
				},

				to: [
					{
						email: to,
					},
				],

				subject: subject,

				htmlContent: html,
			},
			{
				headers: {
					"api-key": process.env.BREVO_API_KEY,
					"Content-Type": "application/json",
				},
			},
		);

		console.log("Email sent successfully:", response.data);

		return response.data;
	} catch (error) {
		console.error("Brevo email error:", error.response?.data || error.message);

		throw error;
	}
};

export default sendEmail;
