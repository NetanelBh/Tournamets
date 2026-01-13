import { useSelector } from "react-redux";

import Table from "../../UI/table/Table";
import BetsLayout from "../layouts/BetsLayout";
import { finalScoreBackground } from "./betsUtils";

const FriendsBets = () => {
	const matchId = localStorage.getItem("matchId");
	// Get the user to know who is the current user between all the friends bet(want to write it in the table as "me")
	const currentUser = useSelector((state) => state.user.user);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);

	const bets = useSelector((state) => state.bets);	

	// If is the first time we entered here, the all users bets list will not exist yet(useEffect run only at the end)
	const betsOfThisMatch = bets.allUsersBets[matchId] ? bets.allUsersBets[matchId] : [];
	
	// Get the current match from the matches list to extract the match name
	const currentMatch = matches.find((match) => match._id === matchId);

	const allUsersBetsData = { headers: ["שם", "תוצאה", "ניחוש"], rows: [], colors: [] };

	allUsers.forEach((user) => {
		const row = [];
		let name = "אני";
		let score = "-";

		// If the iteration user isn't me, get the name from the user of the current iteration
		if (user._id !== currentUser._id) {
			name = user.username;
		}

		// If the current iteration user is in the users bets list, get the score(sometimes user doesn't bet on match)
		const currentIterationUserBet = betsOfThisMatch.find((bet) => bet.userId === user._id);
		
		const userScore = {
			homeScore: -1,
			awayScore: -1,
		};
		if (currentIterationUserBet) {
			score = `${currentIterationUserBet.betScore.homeScore} : ${currentIterationUserBet.betScore.awayScore}`;
			userScore.homeScore = currentIterationUserBet.betScore.homeScore;
			userScore.awayScore = currentIterationUserBet.betScore.awayScore;
		}

		const realScore = {
			homeScore: currentMatch.finalScore.homeScore,
			awayScore: currentMatch.finalScore.awayScore,
		};

		// For each user, find if his score is exact/direction/fail
		const betStatus = finalScoreBackground(userScore, realScore);

		row.push(name);
		row.push(score);
		if (betStatus === "green") {
			row.push("בול");
		} else if (betStatus === "red") {
			row.push("נפילה");
		} else if (betStatus === "blue") {
			row.push("כיוון");
		} else {
			row.push("טרם");
		}

		allUsersBetsData.rows.push(row);

		// The user color in the table according to his bet: exact/direction/fail
		allUsersBetsData.colors.push(betStatus);
	});

	// Sort the colors and rows arrays
	// Create a map of colors and their priority
	const colorsPriority = { green: 0, blue: 1, red: 2 };
	// Combine the colors and rows arrays
	const combinedArrays = allUsersBetsData.colors.map((color, i) => ({ color, rows: allUsersBetsData.rows[i] }));
	// Sort the combined arrays by the colors
	const sortedArrays = combinedArrays.sort((a, b) => colorsPriority[a.color] - colorsPriority[b.color]);

	// Update the rows and colors arrays
	allUsersBetsData.colors = sortedArrays.map((item) => item.color);
	allUsersBetsData.rows = sortedArrays.map((item) => item.rows);

	// Display the match name and the final score
	const matchData = (
		<h1 className="mb-4 mt-4 text-lg text-white">
			{currentMatch.homeTeam}{" "}
			<span className="text-yellow-400 font-normal">
				(
				<span className="font-bold">
					{currentMatch.finalScore.homeScore !== -1 ? currentMatch.finalScore.homeScore : "טרם"}
				</span>
				) <span className="font-bold text-white">:</span> (
				<span className="font-bold">
					{currentMatch.finalScore.awayScore !== -1 ? currentMatch.finalScore.awayScore : "טרם"}
				</span>
				){" "}
			</span>
			{currentMatch.awayTeam}
		</h1>
	);

	return (
		<div className="flex flex-col items-center">
			<BetsLayout />

			{matchData}
			<Table data={allUsersBetsData} isAllUsersMatches={true} />
		</div>
	);
};

export default FriendsBets;
