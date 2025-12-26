const TableHeader = ({ data, theadClass }) => {
	return (
		<thead className={theadClass}>
			<tr>
				{data.map((item, i) => (
					<th key={i} className={item.className}>{item.label}</th>
				))}
			</tr>
		</thead>
	);
};

export default TableHeader;
