import axios from "axios";

const teamNameTranslation = async (term) => {
	const url = "https://en.wikipedia.org/w/api.php";

	const { data } = await axios.get(url, {
		params: {
			action: "query",
			titles: term,
			prop: "langlinks",
			lllang: "he",
			format: "json",
			origin: "*",
		},
	});

	const pages = data.query.pages;
	const pageId = Object.keys(pages)[0];
	const hebrew = pages[pageId]?.langlinks?.[0]?.["*"];
    
	return hebrew || term; // fallback to original if not found
};

export default teamNameTranslation;