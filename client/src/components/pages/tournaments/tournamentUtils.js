// TODO: WHEN FINISH CHECK THE FIXTURES AND MATCH DOCUMENTS IN DB, REMOVE THE CLUE AND UNCOMMENT THE ORIGINAL CLUE
export const createTournamentData = [
	{
		htmlFor: "name",
		label: "שם הטורניר",
		type: "text",
		// clue: "name after /wiki/ (from wikipedia)",
		clue: "UEFA_Euro_2020"
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
		htmlFor: "topScorer",
		label: "לכלול מלך שערים?",
		type: "text",
		// clue: "כן/לא",
		clue: "כן"
	},
	{
		htmlFor: "symbol",
		label: "תמונה",
		type: "text",
		// clue: "Image URL",
		clue: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/UEFA_Euro_2020_logo.svg/1200px-UEFA_Euro_2020_logo.svg.png",
	},
];