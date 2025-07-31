const createTournamentData = () => {
    return [
        {
            htmlFor: "name",
            label: "שם הטורניר",
            type: "text",
            defaultValue: "2016_FIFA_Club_World_Cup"
        },
        {
            htmlFor: "startDate",
            label: "תאריך תחילת הטורניר",
            type: "text",
            defaultValue: "2025-08-10"
        },
        {
            htmlFor: "endDate",
            label: "תאריך סיום הטורניר",
            type: "text",
            defaultValue: "2025-09-10"
        },
        {
            htmlFor: "startTime",
            label: "שעת פתיחת הטורניר",
            type: "text",
            defaultValue: "20:00"
        },
        {
            htmlFor: "topScorer",
            label: "לכלול מלך שערים?",
            type: "text",
            defaultValue: "כן"
        }
    ]
};

export default createTournamentData;