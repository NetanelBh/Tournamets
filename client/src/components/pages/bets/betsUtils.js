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
		roundOf16: "שמינית גמר",
		quarterFinals: "רבע גמר",
		semiFinals: "חצי גמר",
		final: "גמר",
	};

	console.log("stage: ", stage);
	console.log("round: ", round);
	console.log("finalScore: ", finalScore);
	console.log("userBet: ", userBet);
	console.log("pointsRules: ", pointsRules);

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

	// If it's the group stage, calculate the points for this match according to the group stage points rules
	if (stage === "בתים") {
		// Check if the user bet is exact
		if (userHome === realHome && userAway === realAway) {
			points.matchPoints = pointsRules.groupStage.exactScore;
			points.resultType = "exacts";
			// Check if the user bet is direction
		} else if (userHome - userAway > 0 && realHome - realAway > 0) {
			points.matchPoints = pointsRules.groupStage.directionScore;
			points.resultType = "directions";
		} else if (userHome - userAway < 0 && realHome - realAway < 0) {
			points.matchPoints = pointsRules.groupStage.directionScore;
			points.resultType = "directions";
		} else if (userHome - userAway === 0 && realHome - realAway === 0) {
			points.matchPoints = pointsRules.groupStage.directionScore;
			points.resultType = "directions";
		}
        // TODO: HERE, NEED TO SEPARATE TO 2 CASES: 1. IF THE POINTS METHOD IS SAME POINTS FOR KNOCKOUT OR DIFFERENT.
        // TODO: IF SAME, CALCULATE IT AS GROUP STAGE, WHEN IS DIFFERENT USE THE CONVERTER I CREATED ON THE FUNCTION TOP TO GET THE REAL SCORE
	} else {
        // Check if the user bet is exact
        if (userHome === realHome && userAway === realAway) {
            points.matchPoints = pointsRules.knockoutStage.exactScore;
            points.resultType = "exacts";
            // Check if the user bet is direction
        } else if (userHome - userAway > 0 && realHome - realAway > 0) {
            points.matchPoints = pointsRules.knockoutStage.directionScore;
            points.resultType = "directions";
        } else if (userHome - userAway < 0 && realHome - realAway < 0) {
            points.matchPoints = pointsRules.knockoutStage.directionScore;
            points.resultType = "directions";
        }
	}

	return points;
};
