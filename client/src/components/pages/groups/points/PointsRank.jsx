const PointsRank = ({ header, pointsData }) => {
	return (
		<>
			<div className="w-full">
				<span className="mb-2 block text-lg font-medium text-yellow-400 dark:text-gray-200">{header}</span>

				<div className="flex flex-col gap-4 w-full min-w-[300px]">
					{pointsData.map((item) => {
						return (
							<div className="flex items-center gap-1" key={item.title}>
								<label
									htmlFor={`${header} ${item.title}`}
									className="min-w-[50px] text-md font-medium text-white"
								>
									{item.title}
								</label>

								<input
									type="number"
									id={`${header} ${item.title}`}
									placeholder={0}
									className="h-9 w-[65px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-3 focus:ring-blue-500 focus:border-blue-500"
									required
									min={0}
									ref={item.ref}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default PointsRank;
