// TODO: WHEN FINISH CHECK THE FIXTURES AND MATCH DOCUMENTS IN DB, REMOVE THE CLUE AND UNCOMMENT THE ORIGINAL CLUE
export const createTournamentData = [
	{
		htmlFor: "name",
		label: "שם הטורניר",
		type: "text",
		// clue: "name after /wiki/ (from wikipedia)",
		clue: "2026_FIFA_World_Cup"
	},
	{
		htmlFor: "startDate",
		label: "תאריך תחילת הטורניר",
		type: "text",
		// clue: "yyyy-mm-dd",
		clue: "2020-06-15",
	},
	{
		htmlFor: "endDate",
		label: "תאריך סיום הטורניר",
		type: "text",
		// clue: "yyyy-mm-dd",
		clue: "2020-06-22",
	},
	{
		htmlFor: "startTime",
		label: "שעת פתיחת הטורניר",
		type: "text",
		// clue: "שעון ישראל לדוגמא: 20:00",
		clue: "20:00",
	},
	{
		htmlFor: "symbol",
		label: "תמונה",
		type: "text",
		// clue: "Image URL",
		clue: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/UEFA_Euro_2020_logo.svg/1200px-UEFA_Euro_2020_logo.svg.png",
	},
];

export const isTopScorerIncluded = [
	{ htmlFor: "excluded", type: "radio", text: "לא", method: false },
	{ htmlFor: "included", type: "radio", text: "כן", method: true },
];

export const topScorers = {
	htmlFor: "topScorers",
	label: "רשימת שחקנים למלך שערים",
	type: "text",
	clue: "שחקנים למלך שערים(מופרד בפסיק ללא רווחים)",
}