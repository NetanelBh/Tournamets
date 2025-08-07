const SameRankPoints = ({ title }) => {
	return (
		<div className="max-w-sm mx-auto flex items-center mr-0 ml-4">
			<label htmlFor={title} className="w-11 block text-md font-medium text-white dark:text-white">
				{title}
			</label>

			<input
				type="number"
				id={title}
				placeholder={0}
				className="pt-2 pb-2 h-7 w-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				required
				min={0}
			/>
		</div>
	);
};

export default SameRankPoints;
