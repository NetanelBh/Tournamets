const MatchListItem = ({ match }) => {
	console.log(match);

	return (
		<li className="grid grid-cols-10 gap-2 p-4 bg-yellow-200 font-bold border border-teal-900 rounded-lg shadow-[0_0_4px_2px_theme(colors.gray.100)] mb-4">
			<div className="col-span-4 p-2 text-center">{match.homeTeam}</div>
			<input type="text" className="bg-yellow-400 col-span-1 p-2 text-center border border-black"/>
			<input type="text" className="bg-yellow-400 col-span-1 p-2 text-center border border-black"/>
			<div className="col-span-4 p-2 text-center">{match.awayTeam}</div>
		</li>
	);
};

export default MatchListItem;
