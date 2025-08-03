const createTournamentData = () => {
    return [
        {
            htmlFor: "name",
            label: "שם הטורניר",
            type: "text",
            clue: "...pedia.org/wiki/HERE_IS_THE_NAME"
        },
        {
            htmlFor: "startDate",
            label: "תאריך תחילת הטורניר",
            type: "text",
            clue: "yyyy-mm-dd"
        },
        {
            htmlFor: "endDate",
            label: "תאריך סיום הטורניר",
            type: "text",
            clue: "yyyy-mm-dd"
        },
        {
            htmlFor: "startTime",
            label: "שעת פתיחת הטורניר",
            type: "text",
            clue: "שעון ישראל לדוגמא: 20:00"
        },
        {
            htmlFor: "topScorer",
            label: "לכלול מלך שערים?",
            type: "text",
            clue: "כן/לא"
        }
    ]
};

export default createTournamentData;