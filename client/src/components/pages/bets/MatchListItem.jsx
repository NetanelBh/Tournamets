const MatchListItem = ({ match }) => {
	return (
		<li className="grid grid-cols-11 gap-2 p-4 bg-yellow-200/90 font-bold border border-teal-900 rounded-lg shadow-[0_0_4px_2px_theme(colors.gray.100)] mb-4">
			<div className="col-span-4 p-2 text-center">{match.homeTeam}</div>

			{/* If the match is not started yet, let the user place his bet */}
			{!match.isStarted && (
				<div className="col-span-3">
					<div className="grid grid-cols-4">

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
					<button className="w-full mt-3 border border-black rounded-lg shadow-md shadow-gray-700 active:shadow-sm active:shadow-gray-400 active:scale-95 p-0.5">עדכן תוצאה</button>
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

			<div className="col-span-4 p-2 text-center">{match.awayTeam}</div>
		</li>
	);
};

export default MatchListItem;
