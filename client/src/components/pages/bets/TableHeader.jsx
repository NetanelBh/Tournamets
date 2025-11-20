const TableHeader = ({ columns }) => {
	return (
		<thead className="border-b font-medium dark:border-neutral-500">
			<tr>
				{columns.map((col) => (
					<th key={col.key} scope="col" className="px-4 py-2 dark:border-neutral-500">
						{col.label}
					</th>
				))}
			</tr>
		</thead>
	);
};

export default TableHeader;
