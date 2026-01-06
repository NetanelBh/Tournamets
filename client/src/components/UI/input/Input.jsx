const Input = ({data}) => {
	return (
		<>
			<label className="block font-medium text-base text-yellow-400 mb-1" htmlFor={data.htmlFor}>
				{data.label}
			</label>
			<input
				className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-cayn-400 outline-none transition-all font-medium text-white"
				type={data.type}
				id={data.htmlFor}
				ref={data.ref}
				autoComplete={data.autoComplete}
				placeholder={data.placeholder}
				// TODO: REMOVE IT AFTER TESTS
				defaultValue={data.defaultValue}
			/>
		</>
	);
};

export default Input;
