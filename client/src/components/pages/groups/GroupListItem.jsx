const GroupListItem = ({ item, index, btnText, onClick, leave = undefined }) => {
	const main_style = `relative overflow-hidden fade_up mb-3 group rounded-xl border-2 border-yellow-100/70`;

	return (
		<li className={main_style} style={{ animationDelay: `${index * 0.15}s` }}>
			<div className="absolute inset-0 bg-teal-600/60 group-hover:bg-cyan-900/10 transition duration-300 z-0"></div>
			<div className="px-4 py-4 sm:px-4 relative z-10">
				<div className="flex items-center justify-between h-16">
					<p className="mt-1 max-w-2xl text-xl text-white font-medium">
						<span className="text-yellow-400 underline"> שם:</span> {item.name}
					</p>
				</div>
				<div className="mt-4 flex items-center justify-between">
					<button
						className="text-gray-900 bg-yellow-300 hover:scale-95 font-medium rounded-lg shadow-md shadow-gray-700 hover:shadow-sm hover:shadow-gray-400 text-sm px-5 py-2.5 me-2 mb-2 dark:hover:scale-95 cursor-pointer"
						onClick={() => {
							onClick(item._id);
						}}
					>
						{btnText}
					</button>

					<button
						type="button"
						className="text-white bg-red-700 hover:scale-95 font-medium rounded-lg shadow-md shadow-gray-700 hover:shadow-sm hover:shadow-gray-400 text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:scale-95 cursor-pointer"
						onClick={() => {
							leave(item._id);
						}}
					>
						עזיבה
					</button>
				</div>
			</div>
		</li>
	);
};

export default GroupListItem;
