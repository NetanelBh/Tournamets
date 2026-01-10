const TableRow = ({ data, trClass, thClass, tdClass, type=undefined }) => {
	// type determine if the table is for the users points or to show all users bets for all matches
	
	let rowClass = trClass;

	// Paint the first places only if the table is for the users points(for other table like all bets, don't paint)
	if(type) {
		// Determine the color of the 1st and 2nd places
		if (data.i === 0) {
			rowClass = "bg-[#2626FF]/80 hover:bg-[#0000B8]/80 text-white font-medium text-xs";
		} else if (data.i === 1) {
			rowClass = "bg-[#FFCF69]/80 hover:bg-[#FFB81F]/80 text-black font-medium text-xs";
		}
	}

	return (
		<tr key={data.i} className={`${rowClass} points_table`} style={{ animationDelay: `${data.i * 0.35}s` }}>
			<th className={thClass}>{data.i + 1}</th>
			<td className={tdClass}>{data.user.username}</td>
			<td className={tdClass}>{data.user.exacts}</td>
			<td className={tdClass}>{data.user.directions}</td>
			<td className={tdClass}>{data.user.winnerTeamBonus}</td>
			<td className={tdClass}>{data.user.topScorerBonus}</td>
			<td className={tdClass}>{data.user.totalMatchesPoints}</td>
		</tr>
	);
};

export default TableRow;