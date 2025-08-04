import { useRef, useState } from "react";

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const [pointsMethod, setPointsMethod] = useState("differentPoints");
	// State for the payment checkbox
	const [withPayments, setWithPayments] = useState(false);

	const nameRef = useRef();
	const codeRef = useRef();
	// Refs for group stage
	const groupExactRef = useRef();
	const groupDirectionRef = useRef();
	// Refs for knockout stage with samePoints method
	const knockoutExactRef = useRef();
	const knockoutDirectionRef = useRef();
	// Refs for knockout stage with differentPoints method
	const roundOf16ExactRef = useRef();
	const roundOf16DirectionRef = useRef();
	const quarterFinalExactRef = useRef();
	const quarterFinalDirectionRef = useRef();
	const semiFinalExactRef = useRef();
	const semiFinalDirectionRef = useRef();
	const finalExactRef = useRef();
	const finalDirectionRef = useRef();

	return (
		<div className="flex flex-col items-center">
			<div className="show_up max-w-md w-fit sm:w-full bg-cyan-800/70 rounded-xl p-6 mt-2 space-y-4 shadow-sm shadow-gray-400">
				<label htmlFor="name" className="mb-1 block text-lg font-medium text-yellow-400 dark:text-gray-200">
					שם הקבוצה
				</label>

				<input
					type="text"
					id="name"
					className="p-1 mt-0.5 w-full font-medium  text-white rounded border border-gray-300 rounded-md focus:ring-1 focus:border-cayn-300 outline-none transition-all shadow-sm sm:text-base dark:border-gray-600 dark:bg-gray-900 dark:text-white"
				/>
			</div>
		</div>
	);
};

export default CreateGroup;
