import { useRef, useState } from "react";

import * as groupData from "./CreateGroupData";

import GroupInfo from "./GroupInfo";
import SameRankPoints from "./SameRankPoints";
import KnockoutPointsMethod from "./KnockoutPointsMethod";

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const [pointsMethod, setPointsMethod] = useState("");

	const nameRef = useRef();
	const codeRef = useRef();
	const payboxRef = useRef();
	groupData.groupInputs[0].ref = nameRef;
	groupData.groupInputs[1].ref = codeRef;
	groupData.groupInputs[2].ref = payboxRef;

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

	// Get the tournament id from local storage to determine the tournament the group is belongs
	const tournamentId = localStorage.getItem("tournamentId");
	localStorage.removeItem("tournamentId");

	const createGroupHandler = (event) => {
		event.preventDefault();

		console.log(groupData.groupInputs[0].ref.current.value);
	};

	return (
		<div className="flex flex-col items-center">
			<form
				className="show_up max-w-md w-fit sm:w-full bg-cyan-800/70 rounded-xl p-6 mt-2 space-y-4 shadow-sm shadow-gray-400"
				onSubmit={createGroupHandler}
			>
				{/* Contains the name, code and paybox */}
				<GroupInfo data={groupData.groupInputs} />

				{/* Contains the exact and direction points for the group stage */}
				<label
					htmlFor="groutPoints"
					className="mb-2 block text-lg font-medium text-yellow-400 dark:text-gray-200"
				>
					שלב הבתים
				</label>
				<div className="flex flex-col sm:flex-row gap-2">
					<SameRankPoints title="מדויק" />
					<SameRankPoints title="כיוון" />
				</div>

				{/* Contains the points method for the knockout stage */}
				<KnockoutPointsMethod
					data={groupData.knockoutPointsMethod}
					pointMethod={pointsMethod}
					onChange={setPointsMethod}
				/>

				{/* Knockout stage points checkboxes field */}

				<button>click</button>
			</form>
		</div>
	);
};

export default CreateGroup;
