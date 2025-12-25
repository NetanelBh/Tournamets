export const groupInputs = [
	{
		htmlFor: "name",
		label: "בחר שם לקבוצה",
		type: "text",
		placeholder: "",
		autoComplete: "off",
	},
	{
		htmlFor: "code",
		label: "בחר קוד כניסה הקבוצה",
		type: "text",
		placeholder: "ישמש להצטרפות משתמשים לקבוצה",
		autoComplete: "off",
	},
];

export const pointsMethodStyle =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const knockoutPointsMethod = [
	{ htmlFor: "same", type: "radio", text: "ניקוד קבוע", method: "samePoints" },
	{ htmlFor: "different", type: "radio", text: "ניקוד משתנה לכל סיבוב", method: "differentPoints" },
];

export const paymentChoice = [
	{ htmlFor: "forFun", type: "radio", text: "בשביל הכבוד", method: false },
	{ htmlFor: "payment", type: "radio", text: "על כסף בין חברים", method: true },
];

// data array pass to PointsRank component
export const groupPointsData = [{ title: "מדויק" }, { title: "כיוון" }];

// data array pass to PointsRank component
export const knockoutSamePoints = [{ title: "מדויק" }, { title: "כיוון" }];

// Array contains knockout stage groups for each round
export const knockoutDifferentPoints = [
	{
		header: "round of 32",
		data: [{ title: "מדויק" }, { title: "כיוון" }],
	},
	{
		header: "שמינית גמר",
		data: [{ title: "מדויק" }, { title: "כיוון" }],
	},
	{
		header: "רבע גמר",
		data: [{ title: "מדויק" }, { title: "כיוון" }],
	},
	{
		header: "חצי גמר",
		data: [{ title: "מדויק" }, { title: "כיוון" }],
	},
	{
		header: "גמר",
		data: [{ title: "מדויק" }, { title: "כיוון" }],
	},
];

export const joinGroupData = [
	{
		htmlFor: "name",
		label: "שם הקבוצה",
		type: "text",
		autoComplete: "off",
		placeholder: "הזן את שם הקבוצה",
	},
	{
		htmlFor: "code",
		label: "הזן את קוד הקבוצה",
		type: "text",
		autoComplete: "off",
		placeholder: "בקש את הקוד ממנהל הקבוצה",
	},
];

// TODO: REMOVE THE DEFAULT VALUES
export const addMatch = [
	{
		htmlFor: "home",
		label: "קבוצת בית",
		type: "text",
		autoComplete: "off",
		placeholder: "שם קבוצת הבית",
		defaultValue: "א",
	},
	{
		htmlFor: "away",
		label: "קבוצת חוץ",
		type: "text",
		autoComplete: "off",
		placeholder: "שם קבוצת החוץ",
		defaultValue: "ב",
	},
	{
		htmlFor: "date",
		label: "תאריך",
		type: "text",
		autoComplete: "off",
		placeholder: "yyyy-mm-dd",
		defaultValue: "2025-12-25",
	},
	{
		htmlFor: "time",
		label: "שעת המשחק",
		type: "text",
		autoComplete: "off",
		placeholder: "שעון ישראל לדוגמא: 20:00",
		defaultValue: "",
	},
	{
		htmlFor: "stage",
		label: "שלב",
		type: "text",
		autoComplete: "off",
		placeholder: "בתים/נוקאאוט",
		defaultValue: "בתים",
	},
	{
		htmlFor: "round",
		label: "סיבוב",
		type: "text",
		autoComplete: "off",
		placeholder: "שמינית/רבע...",
		defaultValue: "גמר",
	}
]