import axios from "axios";

const getImageFromWikipediaApi = async (imageParams) => {
	try {
		const res = await axios.get("https://en.wikipedia.org/w/api.php", {
			params: imageParams
		});

		return res;
	} catch (err) {
		console.error("Error fetching tournament image:", err.message);
		return null;
	}
};

export default getImageFromWikipediaApi;
