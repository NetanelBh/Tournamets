import { useRef, useState } from "react";

import { groupData, groupPoints, knockoutPoints } from "./CreateGroupData";

// TODO: AFTER CHOOSE THE POINTS METHOD, WILL OPEN A NEW TEXT AREA TO ENTER THE POINTS(CONDITION BELOW THE CHECKBOXES)

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const [pointsMethod, setPointsMethod] = useState("");

	const nameRef = useRef();
	const codeRef = useRef();
	const payboxRef = useRef();
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

	groupData[0].ref = nameRef;
	groupData[1].ref = codeRef;
	groupData[2].ref = payboxRef;

	// Get the tournament id from local storage to determine the tournament the group is belongs
	const tournamentId = localStorage.getItem("tournamentId");
	localStorage.removeItem("tournamentId");

	return (
		<div className="flex flex-col items-center">
			<form className="show_up max-w-md w-fit sm:w-full bg-cyan-800/70 rounded-xl p-6 mt-2 space-y-4 shadow-sm shadow-gray-400">
				{groupData.map((item) => {
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

				{/* Group stage points input fields */}

				{/* Knockout stage points checkboxes field */}
				<fieldset>
					<legend className="sr-only">Checkboxes</legend>

					<div className="flex flex-col">
						<span className="mb-1 block text-lg font-medium text-yellow-400 dark:text-gray-200">
							שלב הנוקאאוט
						</span>

						<div className="flex flex-col sm:flex-row items-start gap-5">
							{knockoutPoints.map((item) => {
								return (
									<div key={item.htmlFor}>
										<label htmlFor={item.htmlFor} className="inline-flex items-center gap-3">
											<input
												type={item.type}
												className="size-5 rounded border-gray-300 checked:bg:yellow-400 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600"
												id={item.htmlFor}
												checked={pointsMethod === item.pointMethod}
												onChange={(e) =>
													setPointsMethod(e.target.checked ? item.pointMethod : "")
												}
											/>

											<span className="font-medium text-white dark:text-gray-200">
												{item.text}
											</span>
										</label>
									</div>
								);
							})}
						</div>
					</div>
				</fieldset>
                
			</form>
		</div>
	);
};

export default CreateGroup;
