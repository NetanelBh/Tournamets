import { useRef } from "react";

import Input from "../../UI/input/Input";
import { joinGroupData } from "./groupUtils";

const JoinGroup = () => {
	const tournamentIs = localStorage.getItem("tournamentId");
	const nameRef = useRef();
	const codeRef = useRef();

	joinGroupData[0].ref = nameRef;
	joinGroupData[1].ref = codeRef;

	const joinGroupHandler = async (event) => {
		event.preventDefault();

		const newGroup = {
			name: nameRef.current.value,
			code: codeRef.current.value,
			tournamentId: tournamentIs,
		};
	};

	return (
		<div className="flex flex-col items-center p-4">
			<form
				className="fade_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl shadow-lg p-6 mt-2 space-y-4 shadow-md shadow-gray-400"
				onSubmit={joinGroupHandler}
			>
				{joinGroupData.map((item) => {
					return <Input key={item.htmlFor} data={item} />;
				})}

				<div className="flex justify-end">
									<button className="w-1/4 bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg hover:shadow-sm transition-colors me-2 mb-2 mt-2">
										כניסה
									</button>
								</div>
			</form>
		</div>
	);
};

export default JoinGroup;
