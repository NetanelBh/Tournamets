import axios from "axios";
import * as cheerio from "cheerio";
import teamNameTranslation from "./teamNameTranslation.js";

const fixturesFetch = async (name) => {
	const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${name}&prop=text&formatversion=2&format=json`;
	try {
		const res = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9",
			},
		});
		const data = res.data;
		
		const $ = cheerio.load(data.parse.text);

		// Each match box is wrapped in .footballbox
		const fixtures = [];
		$(".footballbox").each((_, el) => {
			fixtures.push({
				home: $(el).find(".fhome").text().trim(),
				away: $(el).find(".faway").text().trim(),
				date: $(el).find(".fdate").text().trim(),
				score: $(el).find(".fscore").text().trim(),
			});
		});		

		// Create a new object to overlaod the mutable fixtures got from wikipedia
		const newFixtures = [];

		// Translate the english team name to hebrew
		for (const fixture of fixtures) {
			const [home, away] = await Promise.all([
				teamNameTranslation(fixture.home),
				teamNameTranslation(fixture.away),
			]);

			newFixtures.push({
				date: fixture.date,
				home,
				away,
			});
		}

		return newFixtures;
	} catch (error) {
		console.log(error);
	}
};

export default fixturesFetch;
