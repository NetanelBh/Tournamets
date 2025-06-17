import axios from "axios";

const getImageFromWikipedia = async (tournamentName) => {
	try {
		const res = await axios.get("https://en.wikipedia.org/w/api.php", {
			params: {
				action: "query",
				titles: tournamentName,
				prop: "pageimages",
				format: "json",
				pithumbsize: 500,
			},
		});

		return res;
	} catch (err) {
		console.error("Error fetching tournament image:", err.message);
		return null;
	}
};

export default getImageFromWikipedia;
