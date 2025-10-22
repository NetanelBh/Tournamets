import { useSelector, useDispatch } from "react-redux";
import { betsActions } from "../../store/slices/betSlice";

const MatchListItem = ({ match }) => {	
	const dispatch = useDispatch();

	const userId = useSelector((state) => state.user.user._id);
	
	const updateScoreHandler = (match) => {
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

	return (
		<li className="grid grid-cols-11 gap-2 p-4 bg-gray-100/80 hover:bg-gray-100/90 font-bold rounded-lg shadow-[0_0_5px_3px_theme(colors.yellow.400)] mb-4">
			<div className="sm:text-xl col-span-4 p-2 text-center flex items-center justify-center">
				{match.homeTeam}
			</div>

			{/* If the match is not started yet, let the user place his bet */}
			{!match.isStarted && (
				<div className="col-span-3">
					<div className="grid grid-cols-4 gap-1">
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
								match.matchScoreBet && match.matchScoreBet.betScore.homeScore !== -1
									? match.matchScoreBet.betScore.awayScore
									: ""
							}
						/>
					</div>
					<button
						className="bg-gray-200 w-full mt-3 border border-black rounded-lg shadow-md shadow-gray-700 hover:cursor-pointer active:shadow-sm active:shadow-gray-400 active:scale-95 p-0.5 active:cursor-pointer"
						onClick={() => updateScoreHandler(match)}
					>
						עדכן תוצאה
					</button>
				</div>
			)}

			{/* If the match is started, show the user's result */}
			{match.isStarted && (
				<>
					<div className="bg-yellow-400/80 col-span-1 p-2 text-center border border-black">
						{match.matchScoreBet.betScore.homeScore}
					</div>
					<div className="bg-yellow-400/80 col-span-1 p-2 text-center border border-black">
						{match.matchScoreBet.betScore.awayScore}
					</div>
				</>
			)}

			<div className="sm:text-xl col-span-4 p-2 text-center flex items-center justify-center">
				{match.awayTeam}
			</div>
		</li>
	);
};

export default MatchListItem;
