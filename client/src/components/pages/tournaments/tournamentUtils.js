export const createTournamentData = [
	{
		htmlFor: "name",
		label: "שם הטורניר",
		type: "text",
		clue: "name after /wiki/ (from wikipedia)",
		defaultValue: "2026_FIFA_World_Cup"
	},
	{
		htmlFor: "startDate",
		label: "תאריך תחילת הטורניר",
		type: "text",
		clue: "yyyy-mm-dd",
		// TODO: REMOVE IT AFTER TESTS- ALL THE DEFAULT VALUES HERE
		defaultValue: "2026-06-11"
	},
	{
		htmlFor: "endDate",
		label: "תאריך סיום הטורניר",
		type: "text",
		clue: "yyyy-mm-dd",
		defaultValue: "2026-07-19"
	},
	{
		htmlFor: "startTime",
		label: "שעת פתיחת הטורניר",
		type: "text",
		clue: "שעון ישראל לדוגמא: 20:00",
		defaultValue: "22:00"
	},
	{
		htmlFor: "symbol",
		label: "תמונה",
		type: "text",
		clue: "Image URL",
		defaultValue: "https://upload.wikimedia.org/wikipedia/en/1/17/2026_FIFA_World_Cup_emblem.svg"
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

export const addMatch = [
	{
		htmlFor: "home",
		label: "קבוצת בית",
		type: "text",
		autoComplete: "off",
		placeholder: "שם קבוצת הבית",
	},
	{
		htmlFor: "away",
		label: "קבוצת חוץ",
		type: "text",
		autoComplete: "off",
		placeholder: "שם קבוצת החוץ",
	},
	{
		htmlFor: "date",
		label: "תאריך",
		type: "text",
		autoComplete: "off",
		placeholder: "yyyy-mm-dd",
	},
	{
		htmlFor: "time",
		label: "שעת המשחק",
		type: "text",
		autoComplete: "off",
		placeholder: "שעון ישראל לדוגמא: 20:00",
	},
	{
		htmlFor: "stage",
		label: "שלב",
		type: "text",
		autoComplete: "off",
		placeholder: "בתים/נוקאאוט",
	},
	{
		htmlFor: "round",
		label: "סיבוב",
		type: "text",
		autoComplete: "off",
		placeholder: "גמר/חצי גמר/רבע גמר/שמינית גמר/roundOf32",
	}
]