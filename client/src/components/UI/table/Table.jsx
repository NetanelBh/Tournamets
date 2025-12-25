const Table = ({ data }) => {
	// data prop is an object {headers: [], rows: [], colors: [] - according to the user bet direction/exact/fail}

	return (
		<div className="relative overflow-x-auto shadow-md rounded-lg mb-4">
			<table className="text-center min-w-65 table-auto text-sm font-bold">
				<thead className="text-md text-center uppercase text-white bg-blue-600">
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
								className={`text-${data.colors[i]} font-bold bg-white border-b border-blue-400`}
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
