import axios from "axios";

const teamNameTranslation = async (clubName) => {
	const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clubName)}&langpair=en|he`;

	try {
		const response = await axios.get(url);
		return response.data.responseData.translatedText;
	} catch (error) {
		console.error("Translation error:", error);
		return clubName; // fallback: return original text
	}
};

export default teamNameTranslation;
