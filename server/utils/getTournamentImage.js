import axios from "axios";

const getImageFromWikipediaApi = async (tournamentName) => {
	try {
		// Set the image width 
		const width = 100;
		
		// Step 1: Wikipedia API to get thumbnail
		const wikiResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
			params: {
				action: "query",
				titles: tournamentName,
				prop: "pageimages|pageprops",
				format: "json",
				pithumbsize: width,
			},
		});

		const pages = wikiResponse.data.query.pages;
		const page = Object.values(pages)[0];

		// Return image from Wikipedia if available
		if (page?.thumbnail?.source) {
			return page.thumbnail.source;
		}

		// Step 2: Fallback to Wikidata via pageprops.wikibase_item
		const wikidataId = page?.pageprops?.wikibase_item;
		if (!wikidataId) return null;

		const wikidataResponse = await axios.get(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
		const entity = wikidataResponse.data.entities[wikidataId];

		// Look for logo image (P154)
		const logoClaim = entity?.claims?.P154?.[0]?.mainsnak?.datavalue?.value;
		if (!logoClaim) return null;

		// Construct URL with width control via thumb.php
		return `https://commons.wikimedia.org/w/thumb.php?width=${width}&f=${encodeURIComponent(logoClaim)}`;
	} catch (err) {
		console.error("Error fetching tournament logo:", err.message);
		return null;
	}
};

export default getImageFromWikipediaApi;
