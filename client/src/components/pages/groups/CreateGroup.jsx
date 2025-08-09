import { useRef, useState } from "react";

import * as groupData from "./CreateGroupData";

import GroupInfo from "./GroupInfo";
import PointsRank from "./points/PointsRank";
import KnockoutPointsMethod from "./points/KnockoutPointsMethod";

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

	groupData.groupPointsData[0].ref = groupExactRef;
	groupData.groupPointsData[1].ref = groupDirectionRef;

	// Refs for knockout stage with samePoints method
	const knockoutExactRef = useRef();
	const knockoutDirectionRef = useRef();
	groupData.knockoutSamePoints[0].ref = knockoutExactRef;
	groupData.knockoutSamePoints[1].ref = knockoutDirectionRef;

	// Refs for knockout stage with differentPoints method
	const roundOf16ExactRef = useRef();
	const roundOf16DirectionRef = useRef();
	const quarterFinalExactRef = useRef();
	const quarterFinalDirectionRef = useRef();
	const semiFinalExactRef = useRef();
	const semiFinalDirectionRef = useRef();
	const finalExactRef = useRef();
	const finalDirectionRef = useRef();
	groupData.knockoutDifferentPoints[0].data[0].ref = roundOf16ExactRef;
	groupData.knockoutDifferentPoints[0].data[1].ref = roundOf16DirectionRef;
	groupData.knockoutDifferentPoints[1].data[0].ref = quarterFinalExactRef;
	groupData.knockoutDifferentPoints[1].data[1].ref = quarterFinalDirectionRef;
	groupData.knockoutDifferentPoints[2].data[0].ref = semiFinalExactRef;
	groupData.knockoutDifferentPoints[2].data[1].ref = semiFinalDirectionRef;
	groupData.knockoutDifferentPoints[3].data[0].ref = finalExactRef;
	groupData.knockoutDifferentPoints[3].data[1].ref = finalDirectionRef;

	// Get the tournament id from local storage to determine the tournament the group is belongs
	const tournamentId = localStorage.getItem("tournamentId");
	localStorage.removeItem("tournamentId");

	const createGroupHandler = (event) => {
		event.preventDefault();

		// TODO: CRETE AN OBJECT FROM THIS DATA. JUST NEED TO MAKE A CONDITION IF ITS SAME OR DIFFERENT POINTS
		// TODO: FOR DIFFERENT POINTS THE LINES BELOW WILL BE THE OBJECT + TOURNAMENT ID
		// console.log(groupData.groupInputs[0].ref.current.value);
		// console.log(groupData.groupInputs[1].ref.current.value);
		// console.log(groupData.groupInputs[2].ref.current.value);
		// console.log(groupData.groupPointsData[0].ref.current.value);
		// console.log(groupData.groupPointsData[1].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[0].data[0].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[0].data[1].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[1].data[0].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[1].data[1].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[2].data[0].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[2].data[1].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[3].data[0].ref.current.value);
		// console.log(groupData.knockoutDifferentPoints[3].data[1].ref.current.value);

		// TODO: FOR SAME POINTS THE OBJECT WILL BE WITH THE DATA OF: + TOURNAMENT ID
		console.log(groupData.groupInputs[0].ref.current.value);
		console.log(groupData.groupInputs[1].ref.current.value);
		console.log(groupData.groupInputs[2].ref.current.value);
		console.log(groupData.groupPointsData[0].ref.current.value);
		console.log(groupData.groupPointsData[1].ref.current.value);
		console.log(groupData.knockoutSamePoints[0].ref.current.value);
		console.log(groupData.knockoutSamePoints[1].ref.current.value);
	};

	return (
		<div className="flex flex-col items-center">
			<form
				className="show_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
				onSubmit={createGroupHandler}
			>
				{/* Contains the name, code and paybox */}
				<GroupInfo data={groupData.groupInputs} />

				{/* Contains the exact and direction points for the group stage */}
				<PointsRank header="ניקוד שלב הבתים" pointsData={groupData.groupPointsData} />

				{/* Contains the points method for the knockout stage - checkboxes */}
				<KnockoutPointsMethod
					data={groupData.knockoutPointsMethod}
					pointMethod={pointsMethod}
					onChange={setPointsMethod}
				/>

				{/* Determine the points for the knockout according to the chosen points method */}
				{pointsMethod === "samePoints" && (
					<PointsRank header="ניקוד שלב הנוקאאוט" pointsData={groupData.knockoutSamePoints} />
				)}

				{pointsMethod === "differentPoints" &&
					groupData.knockoutDifferentPoints.map((item) => {
						return <PointsRank header={item.header} pointsData={item.data} key={item.header} />;
					})}

				<div className="flex justify-end">
					<button className="w-1/4 bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg hover:shadow-sm transition-colors me-2 mb-2">
						צור קבוצה
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateGroup;
