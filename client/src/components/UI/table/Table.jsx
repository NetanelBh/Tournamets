const Table = ({ data, type=undefined }) => {
	// data prop is an object {headers: [], rows: [], colors: [] - according to the user bet direction/exact/fail}

	let colorsMap;
	// Type is defined only when we want to display the users match bets. For the rest components, is undefined
	if (type) {
		colorsMap = {
			green: "text-green-600",
			blue: "text-blue-600",
			red: "text-red-600",
		};
	}

	return (
		<div className="relative overflow-x-auto shadow-md rounded-lg mb-4">
			<table className="text-center min-w-65 table-auto text-sm font-bold fade_up">
				<thead className="text-md text-center uppercase text-white bg-[#018790]/60">
					<tr>
						{data.headers.map((header) => (
							<th key={header} scope="col" className="px-6 py-3">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.rows.map((row, i) => {
						return (
							<tr
								key={i}
								className={`${
									colorsMap ? colorsMap[data.colors[i]] : ""
								} font-bold bg-[#F9F8F6] hover:bg-[#EFE9E3] border-b border-blue-400 fade_up`}
							>
								{row.map((cell, i) => (
									<td key={i} className="font-medium whitespace-nowrap px-6 py-4">
										{cell}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
