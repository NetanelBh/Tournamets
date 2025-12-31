import { useState, useRef } from "react";
import { useSelector } from "react-redux";

import API from "../../utils/Api";
import MatchesList from "./MatchesList";
import BetsLayout from "../layouts/BetsLayout";

const ClosedMatches = () => {
	// State data for the SaveButton component
	const [finalScoreUpdateStatus, setFinalScoreUpdateStatus] = useState({});
	// To set timeout when saving the final score in DB to make it again save button
	const timeoutRef = useRef({});

	// Clear the stored matchId(if stored)
	localStorage.removeItem("matchId");

	const matches = useSelector((state) => state.matches.matches);
	// The clock from matchSlice(the clock update each second to make the components rerender for live matches bet list)
	const updatedClock = useSelector((state) => state.clock.now);
	// Get the bets for this tournament and group
	const bets = useSelector((state) => state.bets);	

	// Get only the matches that started
	const startedMatches = matches.filter((match) => match.kickoffTime < updatedClock);

	// Run over the matches that started(the user can't bet on these matches)
	const startedMathesWithBets = startedMatches
		.map((match) => {
			// Find the user's bet for this match from DB bets
			const matchScoreBet = bets.userDbScore.find((score) => score.matchId === match._id);
			// The basic template is without the matchScoreBet(in this case we didn't find the bet in DB - the user didn't bet)
			let matchwithBet = { ...match };
			// Only if the user bet on this match, add the matchScoreBet property with the user's bet score
			if (matchScoreBet) {
				// Create a new object of the match with the user bet
				matchwithBet.matchScoreBet = { ...matchScoreBet };
			}

			return matchwithBet;
		})
		// Sort the matches by date(oldest to newest)
		.sort((match1, match2) => new Date(match1.kickoffTime) - new Date(match2.kickoffTime));

	// Update the final score
	const updateFinalScoreHandler = async ({ match, homeScore, awayScore }) => {
		if (finalScoreUpdateStatus[match._id] == "שומר") return;

		setFinalScoreUpdateStatus((prev) => ({
			...prev,
			[match._id]: "שומר",
		}));

		const finalScore = {
			homeScore,
			awayScore,
		};

		try {
			const resp = await API.patch(`/match/update/${match._id}`, { finalScore });
			if (resp.data.status) {
				setFinalScoreUpdateStatus((prev) => ({ ...prev, [match._id]: "נשמר" }));
			}
		} catch (error) {
			setFinalScoreUpdateStatus((prev) => ({ ...prev, [match._id]: "עדכן תוצאה" }));
		} finally {
			timeoutRef.current[match._id] = setTimeout(() => {
				setFinalScoreUpdateStatus((prev) => ({ ...prev, [match._id]: "עדכן תוצאה" }));
				delete timeoutRef.current[match._id];
			}, 3000);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<BetsLayout />

			{startedMathesWithBets.length === 0 && (
				<h1 className="text-red-400 text-center text-xl mt-2">עדיין לא החלו משחקים</h1>
			)}

			{startedMathesWithBets.length > 0 && (
				<MatchesList
					matches={startedMathesWithBets}
					onClick={updateFinalScoreHandler}
					buttonStatus={finalScoreUpdateStatus}
					actionText="עדכן תוצאה"
					user="admin"
				/>
			)}
		</div>
	);
};

export default ClosedMatches;
