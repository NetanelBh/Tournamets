const PointsRank = ({ header, pointsData }) => {
	return (
		<>
			<span className="mb-2 block text-lg font-medium text-yellow-400 dark:text-gray-200">{header}</span>

			<div className="flex flex-col sm:flex-row gap-2">
				{pointsData.map((item) => {
					return (
						<div className="max-w-sm mx-auto flex items-center mr-0 ml-4" key={item.title}>
							<label
								htmlFor={`${header} ${item.title}`}
								className="w-11 block text-md font-medium text-white dark:text-white"
							>
								{item.title}
							</label>

							<input
								type="number"
								id={`${header} ${item.title}`}
								placeholder={0}
								className="pt-2 pb-2 h-7 w-13 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required
								min={0}
								ref={item.ref}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default PointsRank;
