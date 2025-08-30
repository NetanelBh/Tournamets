import axios from "axios";

const teamNameTranslation = async (clubName) => {
	// Search for the closest Wikipedia page
	const searchRes = await axios.get("https://en.wikipedia.org/w/api.php", {
		params: {
			action: "opensearch",
			search: clubName,
			limit: 1,
			namespace: 0,
			format: "json",
			origin: "*",
		},
	});

	const page = searchRes.data[1][0]; // closest match title
	if (!page) return clubName;

	// Then get Hebrew link
	const langRes = await axios.get("https://en.wikipedia.org/w/api.php", {
		params: {
			action: "query",
			titles: page,
			prop: "langlinks",
			lllang: "he",
			format: "json",
			origin: "*",
		},
	});

	const pages = langRes.data.query.pages;
	const pageId = Object.keys(pages)[0];
	return pages[pageId]?.langlinks?.[0]?.["*"] || clubName;


	// ************** PLAN B (ALSO WORKS) ********************

	// const url = "https://en.wikipedia.org/w/api.php";
	// const { data } = await axios.get(url, {
	// 	params: {
	// 		action: "query",
	// 		titles: term,
	// 		prop: "langlinks",
	// 		lllang: "he",
	// 		format: "json",
	// 		origin: "*",
	// 	},
	// });

	// const pages = data.query.pages;
	// const pageId = Object.keys(pages)[0];
	// const hebrew = pages[pageId]?.langlinks?.[0]?.["*"];

	// return hebrew || term; // fallback to original if not found
};

export default teamNameTranslation;
