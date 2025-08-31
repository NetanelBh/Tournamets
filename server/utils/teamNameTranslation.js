import axios from "axios";

const teamNameTranslation = async (clubName) => {
	// // Search for the closest Wikipedia page
	// const searchRes = await axios.get("https://en.wikipedia.org/w/api.php", {
	// 	params: {
	// 		action: "opensearch",
	// 		search: clubName,
	// 		limit: 1,
	// 		namespace: 0,
	// 		format: "json",
	// 		origin: "*",
	// 	},
	// });

	// const page = searchRes.data[1][0]; // closest match title
	// if (!page) return clubName;

	// // Then get Hebrew link
	// const langRes = await axios.get("https://en.wikipedia.org/w/api.php", {
	// 	params: {
	// 		action: "query",
	// 		titles: page,
	// 		prop: "langlinks",
	// 		lllang: "he",
	// 		format: "json",
	// 		origin: "*",
	// 	},
	// });

	// const pages = langRes.data.query.pages;
	// const pageId = Object.keys(pages)[0];
	// return pages[pageId]?.langlinks?.[0]?.["*"] || clubName;

	try {
		// Handle placeholders like "1B", "2C", "3D"
		const match = clubName.match(/^(\d+)([A-Z])$/);
		if (match) {
			const pos = match[1]; // 1 / 2 / 3
			const group = match[2]; // A / B / C

			// Wikipedia uses "Winners Group A", "Runners-up Group B", "Third place Group C"
			if (pos === "1") return `Winners Group ${group}`;
			if (pos === "2") return `Runners-up Group ${group}`;
			if (pos === "3") return `Third place Group ${group}`;
		}

		// Handle other placeholders from Wiki like "Winner Group A", "Loser Match 45", "TBD"
		if (/Winner|Runner|Loser|TBD/i.test(clubName)) {
			return clubName; // already matches wiki style
		}

		// Otherwise: translate real teams using langlinks
		const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
			clubName
		)}&prop=langlinks&lllang=he&format=json&origin=*`;

		const res = await axios.get(url);
		const pages = res.data?.query?.pages;

		if (!pages) return clubName;

		const pageId = Object.keys(pages)[0];
		const langlinks = pages[pageId].langlinks;

		if (langlinks && langlinks.length > 0) {
			return langlinks[0]["*"]; // Hebrew translation
		}

		return clubName; // fallback to English
	} catch (err) {
		console.error(`Translation error for ${clubName}:`, err.message);
		return clubName;
	}
};

export default teamNameTranslation;
