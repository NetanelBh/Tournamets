export const groupData = [
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

export const groupPoints = {};

export const knockoutPoints = [
	{ htmlFor: "different", type: "checkbox", text: "ניקוד משתנה", pointMethod: "differentPoints" },
	{ htmlFor: "same", type: "checkbox", text: "ניקוד קבוע", pointMethod: "samePoints" },
];
