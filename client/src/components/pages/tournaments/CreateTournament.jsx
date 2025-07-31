import { useRef } from "react";
import API from "../../utils/Api";
import createTournamentData from "./CreateTournamentData";

const CreateTournament = () => {
	const inputData = createTournamentData();
	const nameRef = useRef();
	const startDateRef = useRef();
	const endDateRef = useRef();
	const startTimeRef = useRef();
	const topScorerRef = useRef();
	inputData[0].ref = nameRef;
	inputData[1].ref = startDateRef;
	inputData[2].ref = endDateRef;
	inputData[3].ref = startTimeRef;
	inputData[4].ref = topScorerRef;

	const createTournamentHandler = (event) => {
		event.preventDefault();

		console.log(nameRef.current.value);
		console.log(startDateRef.current.value);
		console.log(endDateRef.current.value);
		console.log(startTimeRef.current.value);
		console.log(topScorerRef.current.value);
	};
	return (
		<div className="flex flex-col items-center p-4">
			<form
				className="fade_up max-w-md w-full bg-cyan-900/50 rounded-xl shadow-lg p-8 mt-8 space-y-4 shadow-md shadow-gray-400"
				onSubmit={createTournamentHandler}
			>
				{inputData.map((item) => {
					return (
						<div key={item.label}>
							<label className="block font-medium text-base text-yellow-400 mb-1" htmlFor={item.htmlFor}>
								{item.label}
							</label>
							<input
								type={item.type}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-white"
								id={item.htmlFor}
								ref={item.ref}
								defaultValue={item.defaultValue}
								autoComplete="off"
							/>
						</div>
					);
				})}
				<button
					className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-white font-medium py-2.5 rounded-lg transition-colors"
					type="submit"
				>
					צור טורניר
				</button>
			</form>
		</div>
	);
};

export default CreateTournament;
