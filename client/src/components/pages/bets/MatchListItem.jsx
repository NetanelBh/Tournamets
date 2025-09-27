const MatchListItem = ({ match }) => {
	console.log(match);

	return (
		<li className="grid grid-cols-10 gap-2 p-4 bg-yellow-200/90 font-bold border border-teal-900 rounded-lg shadow-[0_0_4px_2px_theme(colors.gray.100)] mb-4">
			<div className="col-span-4 p-2 text-center">{match.homeTeam}</div>

			{/* If the match is not started yet, let the user place his bet */}
			{!match.isStarted && (
				<>
					<input
						type="text"
						className="bg-yellow-400/80 col-span-1 p-2 text-center border border-black"
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
						className="bg-yellow-400/80 col-span-1 p-2 text-center border border-black"
						ref={match.refs.awayRef}
						id={match.awayTeam}
						defaultValue={
							match.matchScoreBet && match.matchScoreBet.betScore.homeScore !== -1
								? match.matchScoreBet.betScore.awayScore
								: ""
						}
					/>
				</>
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
