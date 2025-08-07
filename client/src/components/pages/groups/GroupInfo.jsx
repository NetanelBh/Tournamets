const GroupInfo = ({data}) => {
	return (
		<>
			{data.map((item) => {
				return (
					<div key={item.htmlFor}>
						<label
							htmlFor={item.htmlFor}
							className="mb-1 block text-lg font-medium text-yellow-400 dark:text-gray-200"
						>
							{item.label}
						</label>

						<input
							type={item.type}
							id={item.htmlFor}
							ref={item.ref}
							autoComplete="off"
							placeholder={item.clue ? item.clue : ""}
							className="p-1 mt-0.5 w-full font-medium  text-white rounded border border-gray-300 rounded-md focus:ring-1 focus:border-cayn-300 outline-none transition-all shadow-sm sm:text-base dark:border-gray-600 dark:bg-gray-900 dark:text-white"
						/>
					</div>
				);
			})}
		</>
	);
};

export default GroupInfo;
