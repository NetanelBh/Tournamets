export const groupInputs = [
	{
		htmlFor: "name",
		label: "שם הקבוצה",
		type: "text",
	},
	{
		htmlFor: "code",
		label: "בחר קוד כניסה הקבוצה",
		type: "text",
		clue: "ישמש להצטרפות משתמשים לקבוצה",
	},
	{
		htmlFor: "paybox",
		label: "קישור לפייבוקס",
		type: "text",
	},
];

export const pointsMethodStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const knockoutPointsMethod = [
	{ htmlFor: "different", type: "checkbox", text: "ניקוד משתנה", pointMethod: "differentPoints" },
	{ htmlFor: "same", type: "checkbox", text: "ניקוד קבוע", pointMethod: "samePoints" },
];
