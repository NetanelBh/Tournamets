const TableRow = ({ data, trClass, thClass, tdClass }) => {
	// Determine the color of the 1st and 2nd places
	let rowClass = trClass;
	if (data.i === 0) {
		rowClass = "bg-[#2626FF] hover:bg-[#0000B8] text-white font-bold";
	} else if (data.i === 1) {
		rowClass = "bg-[#FFCF69] hover:bg-[#FFB81F] text-black font-bold";
	}

	return (
		<tr key={data.i} className={`${rowClass} points_table`} style={{ animationDelay: `${data.i * 0.3}s` }}>
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