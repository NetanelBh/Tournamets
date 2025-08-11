export const groupInputs = [
	{
		htmlFor: "name",
		label: "בחר שם לקבוצה",
		type: "text",
	},
	{
		htmlFor: "code",
		label: "בחר קוד כניסה הקבוצה",
		type: "text",
		clue: "ישמש להצטרפות משתמשים לקבוצה",
	},
];

export const pointsMethodStyle =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const knockoutPointsMethod = [
	{ htmlFor: "same", type: "checkbox", text: "ניקוד קבוע", method: "samePoints" },
	{ htmlFor: "different", type: "checkbox", text: "ניקוד משתנה לכל סיבוב", method: "differentPoints" },
];

export const paymentData = [{ htmlFor: "paybox", label: "קישור לפייבוקס", type: "text" }];

export const paymentChoice = [
	{ htmlFor: "forFun", type: "checkbox", text: "בשביל הכבוד", method: false },
	{ htmlFor: "payment", type: "checkbox", text: "על כסף בין חברים", method: true },
];

// data array pass to PointsRank component
export const groupPointsData = [{ title: "מדויק" }, { title: "כיוון" }];

// data array pass to PointsRank component
export const knockoutSamePoints = [{ title: "מדויק" }, { title: "כיוון" }];

// Array contains knockout stage groups for each round
export const knockoutDifferentPoints = [
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
