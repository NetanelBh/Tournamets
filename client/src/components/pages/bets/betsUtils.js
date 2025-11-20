// Color Map to insert to tailwind
export const colorMap = {
	green: "bg-green-300",
	red: "bg-red-400",
	blue: "bg-blue-300",
};

export const textColorMap = {
	green: "text-green-300",
	red: "text-red-400",
	blue: "text-blue-300",
};

// Check if the user result is exactly / direction / fail
export const finalScoreBackground = (userBet, realFinalScore) => {
	if (realFinalScore.home === -1 || realFinalScore.away === -1) {
		return "";
	} else if (!userBet) {
		return "red";
	} else if (userBet.homeScore === realFinalScore.home && userBet.awayScore === realFinalScore.away) {
		return "green";
	}
	// Case of draw and direction bet
	else if (userBet.homeScore === userBet.awayScore && realFinalScore.home === realFinalScore.away) {
		return "blue";
	}
	// Case of direction bet (not draw)
	else if (userBet.homeScore > userBet.awayScore && realFinalScore.home > realFinalScore.away) {
		return "blue";
	}
	// Case of direction bet (not draw)
	else if (userBet.homeScore < userBet.awayScore && realFinalScore.home < realFinalScore.away) {
		return "blue";
	} else {
		return "red";
	}
};

export const calculatePoints = (stage, round, finalScore, userBet, pointsRules) => {
	// Used to convert the data in hebrew and the keys in the DB to compare for the points calculation
	const stageConverter = {
		roundOf32: "roundOf32",
		"שמינית גמר": "roundOf16",
		"רבע גמר": "quarterFinals",
		"חצי גמר": "semiFinals",
		גמר: "final",
	};

	const points = { matchPoints: 0, resultType: "fail" };

	// If there is no final score yet, return
	if (finalScore.homeScore === -1 || finalScore.awayScore === -1) {
		return points;
	}

	// Write the results shortly
	const userHome = userBet.betScore.homeScore;
	const userAway = userBet.betScore.awayScore;
	const realHome = finalScore.homeScore;
	const realAway = finalScore.awayScore;
	// Get the points methos for the knockout stage
	const knockoutMethod = pointsRules.knockoutStage.pointsMethod;

	// If it's the group stage, calculate the points for this match according to the group stage points rules
	if (stage === "בתים" || (stage === "נוקאאוט" && knockoutMethod === "samePoints")) {
		// Check if the user bet is exact
		if (userHome === realHome && userAway === realAway) {
			// Assume that the stage is group stage
			points.matchPoints = pointsRules.groupStage.exactScore;
			if (stage === "נוקאאוט") {
				points.matchPoints = pointsRules.knockoutStage.samePoints.exactScore;
			}

			points.resultType = "exacts";
			// Check if the user's bet is direction
		} else if (
			(userHome - userAway > 0 && realHome - realAway > 0) ||
			(userHome - userAway < 0 && realHome - realAway < 0) ||
			(userHome - userAway === 0 && realHome - realAway === 0)
		) {
			// Assume that the stage is group stage
			points.matchPoints = pointsRules.groupStage.directionScore;
			if (stage === "נוקאאוט") {
				points.matchPoints = pointsRules.knockoutStage.samePoints.directionScore;
			}

			points.resultType = "directions";
		}
		// In this case, the knockout stage points rules is different between the rounds (4/2,6/3,8/4.....)
	} else {
		// Check if the user bet is exact
		if (userHome === realHome && userAway === realAway) {
			points.matchPoints = pointsRules.knockoutStage.differentPoints[stageConverter[round]].exactScore;
			points.resultType = "exacts";
			// Check if the user bet is direction
		} else if (
			(userHome - userAway > 0 && realHome - realAway > 0) ||
			(userHome - userAway < 0 && realHome - realAway < 0) ||
			(userHome - userAway === 0 && realHome - realAway === 0)
		) {
			points.matchPoints = pointsRules.knockoutStage.differentPoints[stageConverter[round]].directionScore;
			points.resultType = "directions";
		}
	}

	return points;
};

export const tableColumns = [
  { key: "rank", label: "#", className: "whitespace-nowrap  px-4 py-4 font-medium dark:border-neutral-500" },
  { key: "username", label: "שם", className: "whitespace-nowrap  px-4 py-4 dark:border-neutral-500 font-bold" },
  { key: "exacts", label: "ניחוש מדויק", className: "whitespace-nowrap  px-4 py-4 dark:border-neutral-500" },
  { key: "directions", label: "כיוון", className: "px-4 py-4 dark:border-neutral-500" },
  { key: "winnerTeamBonus", label: "בונוס אלופה", className: "whitespace-nowrap  px-4 py-4 dark:border-neutral-500" },
  { key: "topScorerBonus", label: "בונוס מלך השערים", className: "whitespace-nowrap  px-4 py-4 dark:border-neutral-500" },
  { key: "totalMatchesPoints", label: `סה"כ`, className: "px-4 py-4 dark:border-neutral-500" },
];