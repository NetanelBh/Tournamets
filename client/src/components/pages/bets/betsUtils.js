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
	{
		key: "topScorerBonus",
		label: "בונוס מלך השערים",
		className: "whitespace-nowrap  px-4 py-4 dark:border-neutral-500",
	},
	{ key: "totalMatchesPoints", label: `סה"כ`, className: "px-4 py-4 dark:border-neutral-500" },
];

export const usersPoints = (data) => {
	const returendData = data.allUsers.map((user) => {
		const finalUserPoints = {
			username: user.username,
			exacts: 0,
			directions: 0,
			winnerTeamBonus: 0,
			topScorerBonus: 0,
			totalMatchesPoints: 0,
		};

		data.matches.forEach((match) => {
			// Each match iteration, will take the corresponding match in the allUsersBets matches(the key is matchId)
			const matchBets = data.usersBets.allUsersBets[match._id];
			// If all users didn't bet on this match it will be undefined, and we want to avoid from errors
			if (matchBets) {
				// Check if the user has a bet for the current match
				const userBet = matchBets.find((bet) => bet.userId === user._id);
				if (userBet) {
					const userPoints = calculatePoints(
						match.stage,
						match.round,
						match.finalScore,
						userBet,
						data.groupPointsRules
					);

					// Only if exact or direction, add 1 to the statistics
					if (finalUserPoints[userPoints.resultType] !== undefined)
						finalUserPoints[userPoints.resultType] += 1;

					finalUserPoints.totalMatchesPoints += userPoints.matchPoints;
				}
			}
		});

		// Get the current user from the users list of the top player predictions
		const currUserTopScorer = data.usersTopScorers.find((u) => u.user === user._id);
		// Check if not undefined because at first time it will be empty until fetch from useEffect in Table page
		if (currUserTopScorer) {
			if (currUserTopScorer.topScorer === data.tournamentTopScorerId) {
				finalUserPoints.topScorerBonus = 10;
			}
		}

		// Get the current user from the users list of the winner team predictions
		const currUserWinnerTeam = data.usersWinnerTeams.find((u) => u.user === user._id);
		// Check if not undefined because at first time it will be empty until fetch from useEffect in Table page
		if (currUserWinnerTeam) {
			if (currUserWinnerTeam.winnerTeam === data.tournamentWinnerTeamId) {
				finalUserPoints.winnerTeamBonus = 10;
			}
		}

		finalUserPoints.totalMatchesPoints += finalUserPoints.topScorerBonus + finalUserPoints.winnerTeamBonus;

		return finalUserPoints;
	});

	// Sort the users by points, if same, sort by exacts and directions, then by winner team, finally by top scorer
	const sortedUsers = returendData.sort(
		(a, b) =>
			b.totalMatchesPoints - a.totalMatchesPoints ||
			b.exacts - a.exacts ||
			b.directions - a.directions ||
			b.winnerTeamBonus - a.winnerTeamBonus ||
			b.topScorerBonus - a.topScorerBonus
	);

	return sortedUsers;
};

export const groupPointsExplain = (pointsRules) => {
	const exactTemplate = "מדויק -  ";
	const directionTemplate = "כיוון -  ";
	const pointsTemplate = "נקודות";

	// Uses to extract the data for the group stage
	const groupExact = `${exactTemplate}${pointsRules.groupStage.exactScore} ${pointsTemplate}`;
	const groupDirection = `${directionTemplate}${pointsRules.groupStage.directionScore} ${pointsTemplate}`;

	const rules = { groupStage: [groupExact, groupDirection], knockoutStage: [] };

	if (pointsRules.knockoutStage.pointsMethod === "samePoints") {
		// Extract the points for the knockout stage
		const samePoints = pointsRules.knockoutStage.samePoints;
		rules.knockoutStage.push(`${exactTemplate}${samePoints.exactScore} ${pointsTemplate}`);
		rules.knockoutStage.push(`${directionTemplate}${samePoints.directionScore} ${pointsTemplate}`);

		return rules;
	}

	// This section, calculate the points if the points method is different between the stages(final/semi...)
	const differentPoints = pointsRules.knockoutStage.differentPoints;
	// Get all levels name from the points rules and store it for sort(ascending)
	const tempArray = [];
	for (const level in differentPoints) {
		tempArray.push({level: level, points: differentPoints[level]});
		// Sort the array to show the rules from the first stage to final(ascending)
		tempArray.sort((a, b) => b.points.exactScore - a.points.exactScore);
	}
	
	// After the array sort, create the points rules text for the knockout stage
	for (const score of tempArray) {
		rules.knockoutStage.push(`${levelsTranslation[score.level]} גמר: ${exactTemplate}${differentPoints[score.level].exactScore} ${pointsTemplate}`);
		rules.knockoutStage.push(`${levelsTranslation[score.level]} גמר: ${directionTemplate}${differentPoints[score.level].directionScore} ${pointsTemplate}`);
	}
	

	return rules;
};

const levelsTranslation = {
	"roundOf32": "1/16",
	"roundOf16": "שמינית",
	"quarterFinal": "רבע",
	"semiFinal": "חצי",
	"final": "",
}
