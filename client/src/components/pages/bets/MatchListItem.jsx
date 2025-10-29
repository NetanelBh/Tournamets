import { useSelector, useDispatch } from "react-redux";
import { betsActions } from "../../store/slices/betSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { finalScoreBackground, colorMap, textColorMap } from "./betsUtils";

const MatchListItem = ({ match }) => {
	const dispatch = useDispatch();

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
	
	// TODOD: ADD BUTTON TO FRIENDS RESULTS
	// TODO: GET THE FINAL SCORE FROM THE DB(WHEN I UPDATE THE DB, HE WILL UPDATE AUTOMATICALLY THE UI)

	const scoreFromDbTest = {home: 2, away: 1}
	// Determine the color of the final result(green for exact bet, red for wrong bet and blue for direction bet)
	const scoreColor = finalScoreBackground(match.matchScoreBet.betScore, scoreFromDbTest)

	// Get the match's kickoff time and display it on the screen in the list item
	const kickoffTime = (new Date(match.kickoffTime).toLocaleString()).replace(","," |").slice(0, -3);

	return (
		<li className="grid grid-cols-13 gap-2 pr-4 pl-4 pb-2 bg-gray-300/80 hover:bg-gray-300 font-bold rounded-lg shadow-[0_2px_5px_2px_theme(colors.teal.300)] mb-4">
			<div className={`sm:text-xl col-span-4 p-2 ${!match.isStarted ? 'pt-8' : ""} text-center flex items-center justify-center`}>
				{match.homeTeam}
			</div>

			{/* If the match is not started yet, let the user place his bet */}
			{!match.isStarted && (
				<div className="col-span-5">
					<h3 className="text-center text-white bg-gray-800 mb-3 rounded-b-xl pb-1">{match.round}</h3>
					<p className="text-xs text-center text-black font-bold">{kickoffTime}</p>

					<div className="grid grid-cols-4 gap-1 mt-4">
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
						className="bg-gray-200 w-full mt-3 border border-black rounded-lg shadow-md shadow-gray-700 hover:cursor-pointer active:shadow-sm active:shadow-gray-400 active:scale-95 p-0.5 active:cursor-pointer"
						onClick={() => updateScoreHandler(match)}
					>
						עדכן
					</button>
				</div>
			)}

			{/* If the match is started, show the user's result */}
			{match.isStarted && (
				<div className="col-span-5">
					<h3 className="text-center text-white bg-gray-800 mb-1 rounded-b-xl pb-1 text-sm">ההימור שלי</h3>

					<div className="grid grid-cols-4 gap-1">
						<div className={`${scoreColor !== "" ? colorMap[scoreColor] : "bg-yellow-400/80"} col-span-2 text-center border border-black h-6`}>
							{match.matchScoreBet.betScore.homeScore}
						</div>
						<div className={`${scoreColor !== "" ? colorMap[scoreColor] : "bg-yellow-400/80"} col-span-2 text-center border border-black h-6`}>
							{match.matchScoreBet.betScore.awayScore}
						</div>
					</div>

					{/* Show the bet prediction: מדויק/כיוון/נפילה */}
					{scoreColor === "green" && <p className={`text-center mt-1 fontt-bold ${textColorMap[scoreColor]}`}>מדויק</p>}
					{scoreColor === "red" && <p className={`text-center mt-1 fontt-bold ${textColorMap[scoreColor]}`}>נפילה</p>}
					{scoreColor === "blue" && <p className={`text-center mt-1 fontt-bold ${textColorMap[scoreColor]}`}>כיוון</p>}

					<p className="text-center text-white bg-gray-800 mb-1 mt-4 pb-1 pl-1 pr-1 text-xs">תוצאה סופית</p>

					<div className="grid grid-cols-4 gap-1">
						<div className="bg-yellow-400/80 col-span-2 text-center border border-black h-6">
							{scoreFromDbTest.home !== -1 && scoreFromDbTest.away !== -1 ? scoreFromDbTest.home : ""}
						</div>
						<div className="bg-yellow-400/80 col-span-2 text-center border border-black h-6">
							{scoreFromDbTest.away !== -1 && scoreFromDbTest.home !== -1 ? scoreFromDbTest.away : ""}
						</div>
					</div>
				</div>
			)}

			<div className={`sm:text-xl col-span-4 p-2 ${!match.isStarted ? 'pt-8' : ""} text-center flex items-center justify-center`}>
				{match.awayTeam}
			</div>
		</li>
	);
};

export default MatchListItem;
