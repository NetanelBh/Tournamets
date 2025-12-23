const RadioButtonsArea = ({ header, data, check, onChange }) => {    
	return (
		<fieldset>
			<legend className="sr-only">Points</legend>

			<div className="flex flex-col">
				<span className="mb-1 block text-lg font-medium text-yellow-400 dark:text-gray-200">{header}</span>

				<div className="w-full flex flex-col sm:flex-row items-start gap-2">
					{data.map((item) => {
						return (
							<div key={item.htmlFor}>
								<label htmlFor={item.htmlFor} className="w-full flex items-center gap-3">
									<input
										type={item.type}
										className="size-5 rounded border-gray-300 checked:bg:yellow-400 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600"
										id={item.htmlFor}
										checked={check === item.method}
										onChange={() => onChange(item.method)}
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

export default RadioButtonsArea;
