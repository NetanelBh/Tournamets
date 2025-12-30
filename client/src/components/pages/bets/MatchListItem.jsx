import styles from "./MatchListItem.module.css";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import SaveButton from "../../UI/saveButton/SaveButton";
import { finalScoreBackground, colorMap, textColorMap } from "./betsUtils";

const MatchListItem = ({ match, onClick, buttonStatus, actionText, user }) => {	
	const navigate = useNavigate();

	// Referenced for update the final score(only admin can update the final score, instead do it manually in MongoDB)
	const homeRef = useRef(null);
	const awayRef = useRef(null);
	// The clock from matchSlice(the clock update each second to make the components rerender for live matches bet list)
	const updatedClock = useSelector((state) => state.clock.now);
	// Get the admin status to determine if the user can update the final score(instead do it manually in MongoDB)
	const isAdmin = sessionStorage.getItem("isAdmin");

	// Sometimes when save the bets, there is a failure, we want to display the fail message on the button
	let newActionText = actionText;
	
	// This buttonClass for the admin when need to update the final score
	let buttonClass = `${
		buttonStatus === "נשמר" ? "bg-green-400" : "bg-red-600"
	} text-white rounded-lg p-1 cursor-pointer mt-2 w-full hover:scale-95 active:scale-95`;

	if (user === "regular") {
		if(buttonStatus === "נשמר") {
			newActionText = "נשמר"
			buttonClass = 
				"bg-green-400 w-full mt-2 border border-black rounded-lg p-0.5"
		} else if(buttonStatus === "נכשל") {
			newActionText = "נכשל, נסה שנית"
			buttonClass = 
				"bg-red-500 w-full mt-2 border border-black rounded-lg p-0.5"
		} else {
			buttonClass = 
				"bg-gray-200 w-full mt-2 border border-black rounded-lg hover:cursor-pointer hover:scale-95 active:scale-95 p-0.5 active:cursor-pointer"
		}
	}


	const saveClickedHandler = (e) => {
		e.preventDefault();

		const homeScore = Number(homeRef.current.value);
		const awayScore = Number(awayRef.current.value);

		// In case the user clicked save without insert scores
		if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;
		
		onClick({
			match,
			homeScore,
			awayScore
		});
	};

	const friendsBetsHandler = () => {
		// Store the matchId in localStorage to use it in the friends bets page
		localStorage.setItem("matchId", match._id);

		navigate("/layout/friends-bets");
	};

	const scoreFromDb = { homeScore: match.finalScore.homeScore, awayScore: match.finalScore.awayScore };
	// Determine the color of the final result(green for exact bet, red for wrong bet and blue for direction bet) only if the user bet on this match
	const scoreColor = finalScoreBackground(match.matchScoreBet ? match.matchScoreBet.betScore : null, scoreFromDb);

	// Get the match's kickoff time and display it on the screen in the list item
	const kickoffTime = new Date(match.kickoffTime).toLocaleString().replace(",", " |").slice(0, -3);

	return (
		<li className="grid grid-cols-13 gap-2 pr-4 pl-4 pb-2 bg-gray-700 hover:bg-gray-700/80 font-bold rounded-lg shadow-[0_2px_5px_2px_theme(colors.yellow.300)] mb-6 mr-2 ml-2">
			<div
				className={`sm:text-xl col-span-4 p-2 text-white ${
					match.kickoffTime > updatedClock ? "pt-8" : ""
				} text-center flex items-center justify-center`}
			>
				{match.homeTeam}
			</div>

			{/* If the match is not started yet, let the user place his bet */}
			{match.kickoffTime > updatedClock && (
				<form className="col-span-5" onSubmit={saveClickedHandler}>
					<h3 className="text-center text-white bg-gray-800 mb-2 rounded-b-xl pb-1">{match.round}</h3>
					<p className="text-xs text-center text-white font-bold">{kickoffTime}</p>

					<div className="grid grid-cols-4 gap-1 mt-2">
						<input
							type="number"
							className="col-span-2 bg-yellow-400/80 p-2 text-center border border-black"
							ref={homeRef}
							id={match.homeTeam}
							defaultValue={
								match.matchScoreBet && match.matchScoreBet.betScore.homeScore !== -1
									? match.matchScoreBet.betScore.homeScore
									: ""
							}
						/>

						<input
							type="number"
							className="col-span-2 bg-yellow-400/80 p-2 text-center border border-black"
							ref={awayRef}
							id={match.awayTeam}
							defaultValue={
								match.matchScoreBet && match.matchScoreBet.betScore.awayScore !== -1
									? match.matchScoreBet.betScore.awayScore
									: ""
							}
						/>
					</div>

					<SaveButton status={buttonStatus} buttonText={newActionText} className={buttonClass} />
				</form>
			)}

			{/* If the match is started, show the user's result */}
			{match.kickoffTime < updatedClock && (
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
							{scoreFromDb.homeScore !== -1 && scoreFromDb.awayScore !== -1
								? scoreFromDb.homeScore
								: "טרם"}
						</div>
						<div className="bg-gray-300 col-span-2 text-center border border-black h-6">
							{scoreFromDb.awayScore !== -1 && scoreFromDb.homeScore !== -1
								? scoreFromDb.awayScore
								: "טרם"}
						</div>
					</div>

					{/* Only admin can set the final score for matches the just finished */}
					{isAdmin && scoreFromDb.homeScore === -1 && scoreFromDb.awayScore === -1 && (
						<form
							className="flex flex-col items-center mt-4 w-full lg:w-3/4 mx-auto"
							onSubmit={saveClickedHandler}
						>
							<div className="flex w-full gap-2 mt-2 h-6">
								<input
									type="number"
									className="w-1/2 bg-yellow-400/80 p-2 text-center border border-black"
									ref={homeRef}
									id={match.homeTeam}
									defaultValue=""
								/>
								<input
									type="number"
									className="w-1/2 bg-yellow-400/80 p-2 text-center border border-black"
									ref={awayRef}
									id={match.awayTeam}
									defaultValue=""
								/>
							</div>

							<SaveButton status={buttonStatus} buttonText={newActionText} className={buttonClass} />
						</form>
					)}
				</div>
			)}

			<div
				className={`sm:text-xl col-span-4 p-2 text-white ${
					match.kickoffTime > updatedClock ? "pt-8" : ""
				} text-center flex items-center justify-center`}
			>
				{match.awayTeam}
			</div>

			{/* Friends bets button - show only if the match is started*/}
			{match.kickoffTime < updatedClock && (
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
