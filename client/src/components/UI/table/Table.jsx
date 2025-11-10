const Table = ({ data }) => {
	// data prop is an object {headers: [], rows: []}
	return (
		<div className="relative overflow-x-auto shadow-md rounded-lg mb-4">
			<table className="text-center min-w-65 table-auto text-sm font-bold dark:text-blue-100">
				<thead className="text-md text-center uppercase text-white bg-blue-600 dark:bg-gray-700 dark:text-white">
					<tr>
						{data.headers.map((header) => (
							<th key={header} scope="col" className="px-6 py-3">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.rows.map((row, index) => (
						<tr
							key={index}
							className={`${row.includes("אני") ? "text-red-600 font-bold" : ""} ${
								index % 2 === 0 ? "bg-[#FFFDF0]" : "bg-[#FFF2C2]"
							} border-b border-blue-400`}
						>
							{row.map((cell, index) => (
								<td key={index} className="font-medium whitespace-nowrap dark:text-blue-100 px-6 py-4">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
