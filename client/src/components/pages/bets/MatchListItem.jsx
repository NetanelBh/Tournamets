import styles from "./MatchListItem.module.css";

import { useSelector, useDispatch } from "react-redux";
import { betsActions } from "../../store/slices/betSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { finalScoreBackground, colorMap, textColorMap } from "./betsUtils";
import { useNavigate } from "react-router-dom";

const MatchListItem = ({ match }) => {	
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userId = useSelector((state) => state.user.user._id);

	const updateScoreHandler = (match) => {
		// Before update, check if the match started(in case the browser was open for long time and the match started)
		if (match.kickoffTime > new Date().toISOString()) {
			// If started, change the flag of isStarted to true in redux
			dispatch(matchesActions.updateStartTime());
		}

		// Get the bet data from the inputs
		const bet = {
			tournamentId: match.tournament,
			userId: userId,
			groupId: localStorage.getItem("groupId"),
			matchId: match._id,
			betScore: {
				homeScore: Number(match.refs.homeRef.current.value),
				awayScore: Number(match.refs.awayRef.current.value),
			},
		};

		dispatch(betsActions.placeBet(bet));
	};

	const friendsBetsHandler = () => {
		// Store the matchId in localStorage to use it in the friends bets page
		localStorage.setItem("matchId", match._id);

		navigate("/layout/bets-layout/frients-bets");
	};

	const scoreFromDb = { home: match.finalScore.homeScore, away: match.finalScore.awayScore };
	// Determine the color of the final result(green for exact bet, red for wrong bet and blue for direction bet) only if the user bet on this match
	const scoreColor = finalScoreBackground(match.matchScoreBet ? match.matchScoreBet.betScore : null, scoreFromDb);

	// Get the match's kickoff time and display it on the screen in the list item
	const kickoffTime = new Date(match.kickoffTime).toLocaleString().replace(",", " |").slice(0, -3);

	return (
		<li className="grid grid-cols-13 gap-2 pr-4 pl-4 pb-2 bg-gray-700 hover:bg-gray-700/80 font-bold rounded-lg shadow-[0_2px_5px_2px_theme(colors.yellow.300)] mb-6 mr-2 ml-2">
			<div
				className={`sm:text-xl col-span-4 p-2 text-white ${
					!match.isStarted ? "pt-8" : ""
				} text-center flex items-center justify-center`}
			>
				{match.homeTeam}
			</div>

			{/* If the match is not started yet, let the user place his bet */}
			{!match.isStarted && (
				<div className="col-span-5">
					<h3 className="text-center text-white bg-gray-800 mb-2 rounded-b-xl pb-1">{match.round}</h3>
					<p className="text-xs text-center text-white font-bold">{kickoffTime}</p>

					<div className="grid grid-cols-4 gap-1 mt-2">
						<input
							type="text"
							className="col-span-2 bg-yellow-400/80 p-2 text-center border border-black"
							ref={match.refs.homeRef}
							id={match.homeTeam}
							defaultValue={
								match.matchScoreBet && match.matchScoreBet.betScore.homeScore !== -1
									? match.matchScoreBet.betScore.homeScore
									: ""
							}
						/>

						<input
							type="text"
							className="col-span-2 bg-yellow-400/80 p-2 text-center border border-black"
							ref={match.refs.awayRef}
							id={match.awayTeam}
							defaultValue={
								match.matchScoreBet && match.matchScoreBet.betScore.awayScore !== -1
									? match.matchScoreBet.betScore.awayScore
									: ""
							}
						/>
					</div>

					<button
						className="bg-gray-200 w-full mt-2 border border-black rounded-lg shadow-sm shadow-yellow-400 hover:cursor-pointer active:shadow-sm active:shadow-gray-400 active:scale-95 p-0.5 active:cursor-pointer"
						onClick={() => updateScoreHandler(match)}
					>
						עדכן
					</button>
				</div>
			)}

			{/* If the match is started, show the user's result */}
			{match.isStarted && (
				<div className="col-span-5 w-full">
					<h3 className="justify-self-center w-full lg:w-3/4 text-center text-white bg-gray-800 mb-1 rounded-b-xl pb-1 text-sm">
						התוצאה שלי
					</h3>

					<div className="justify-self-center w-full lg:w-3/4 grid grid-cols-4 gap-1">
						<div
							className={`${
								scoreColor !== "" ? colorMap[scoreColor] : "bg-yellow-400/80"
							} col-span-2 text-center border border-black h-6`}
						>
							{match.matchScoreBet ? match.matchScoreBet.betScore.homeScore : "-"}
						</div>
						<div
							className={`${
								scoreColor !== "" ? colorMap[scoreColor] : "bg-yellow-400/80"
							} col-span-2 text-center border border-black h-6`}
						>
							{match.matchScoreBet ? match.matchScoreBet.betScore.awayScore : "-"}
						</div>
					</div>

					{/* Show the bet prediction: מדויק/כיוון/נפילה */}
					{scoreColor === "green" && (
						<p
							className={`mt-1 justify-self-center lg:w-3/4 text-center fontt-bold ${textColorMap[scoreColor]}`}
						>
							בול
						</p>
					)}
					{scoreColor === "red" && (
						<p
							className={`mt-1 justify-self-center lg:w-3/4 text-center fontt-bold ${textColorMap[scoreColor]}`}
						>
							נפילה
						</p>
					)}
					{scoreColor === "blue" && (
						<p
							className={`mt-1 justify-self-center lg:w-3/4 text-center fontt-bold ${textColorMap[scoreColor]}`}
						>
							כיוון
						</p>
					)}

					<p className="justify-self-center w-full lg:w-3/4 text-center text-white bg-gray-800 mt-4 pb-1 pl-1 pr-1 text-xs">
						תוצאה סופית
					</p>

					<div className="w-full lg:w-3/4 grid grid-cols-4 gap-1 justify-self-center">
						<div className="bg-gray-300 col-span-2 text-center border border-black h-6">
							{scoreFromDb.home !== -1 && scoreFromDb.away !== -1 ? scoreFromDb.home : "טרם"}
						</div>
						<div className="bg-gray-300 col-span-2 text-center border border-black h-6">
							{scoreFromDb.away !== -1 && scoreFromDb.home !== -1 ? scoreFromDb.away : "טרם"}
						</div>
					</div>
				</div>
			)}

			<div
				className={`sm:text-xl col-span-4 p-2 text-white ${
					!match.isStarted ? "pt-8" : ""
				} text-center flex items-center justify-center`}
			>
				{match.awayTeam}
			</div>

			{/* Friends bets button - show only if the match is started*/}
			{match.isStarted && (
				<div className="lg:w-col-span-5 lg:col-start-4 col-span-7 col-start-4 flex justify-center mt-2 mb-1 border border-white border-2 hover:cursor-pointer hover:scale-95 active:cursor-pointer active:scale-95 rounded-2xl bg-teal-700 text-yellow-300 text-lg">
					<button className="hover:cursor-pointer active:cursor-pointer" onClick={friendsBetsHandler}>
						הימורי החברים{" "}
						<span className="mr-2">
							<span className={styles.blink_1}>{">"}</span>
							<span className={styles.blink_2}>{">"}</span>
						</span>
					</button>
				</div>
			)}
		</li>
	);
};

export default MatchListItem;
