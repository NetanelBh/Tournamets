const KnockoutPointsMethod = ({ data, pointMethod, onChange }) => {    
	return (
		<fieldset>
			<legend className="sr-only">Points</legend>

			<div className="flex flex-col">
				<span className="mb-1 block text-lg font-medium text-yellow-400 dark:text-gray-200">שיטת ניקוד לשלב הנוקאאוט</span>

				<div className="flex flex-col sm:flex-row items-start gap-5">
					{data.map((item) => {
						return (
							<div key={item.htmlFor}>
								<label htmlFor={item.htmlFor} className="inline-flex items-center gap-3">
									<input
										type={item.type}
										className="size-5 rounded border-gray-300 checked:bg:yellow-400 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600"
										id={item.htmlFor}
										checked={pointMethod === item.pointMethod}
										onChange={(e) => onChange(e.target.checked ? item.pointMethod : "")}
									/>

									<span className="font-medium text-white dark:text-gray-200">{item.text}</span>
								</label>
							</div>
						);
					})}
				</div>
			</div>
		</fieldset>
	);
};

export default KnockoutPointsMethod;
