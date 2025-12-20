import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import { addMatch } from "./groupUtils";
import Input from "../../UI/input/Input";
import Loading from "../../UI/loading/Loading";
import { matchesActions } from "../../store/slices/matchesSlice";
import israelToUTC from "../../../../../server/utils/ConvertIsraelTimeToUtc";
import { loadingActions } from "../../store/slices/loadingSlice";
import { selectIsLoading } from "../../store/slices/loadingSlice";

const AddMatch = () => {
	const homeTeamRef = useRef();
	const awayTeamRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const stageRef = useRef();
	const roundRef = useRef();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");

	const isLoading = useSelector(selectIsLoading);

	addMatch[0].ref = homeTeamRef;
	addMatch[1].ref = awayTeamRef;
	addMatch[2].ref = dateRef;
	addMatch[3].ref = timeRef;
	addMatch[4].ref = stageRef;
	addMatch[5].ref = roundRef;

	const createMatchHandler = async (event) => {
		event.preventDefault();

		const utcTime = israelToUTC(dateRef.current.value, timeRef.current.value);

		const match = {
			homeTeam: homeTeamRef.current.value,
			awayTeam: awayTeamRef.current.value,
			tournament: localStorage.getItem("tournamentId"),
			kickoffTime: utcTime,
			stage: stageRef.current.value,
			round: roundRef.current.value,
			finalScore: { homeScore: -1, awayScore: -1 },
		};

		dispatch(loadingActions.start());
		try {
			const resp = await API.post("/match/create", { match });
			if (resp.data.status) {
				setOpenModal(true);
				setModalText("המשחק נוצר בהצלחה");
				dispatch(matchesActions.addMatch(resp.data.data));
			} else {
				setOpenModal(true);
				setModalText(resp.data.data);
			}
		} catch (error) {
			setModalText("אירעה שגיאה ביצירת המשחק, אנא נסה שנית");
		} finally {
			dispatch(loadingActions.stop());
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate("/layout/groups-layout/add-match");
	};

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col items-center">
							<form
								className="show_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
								onSubmit={createMatchHandler}
							>
								{addMatch.map((input) => {
									return <Input key={input.htmlFor} data={input} />;
								})}

								<button
									className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg transition-colors"
									type="submit"
								>
									צור משחק
								</button>
							</form>
						</div>
					)}

					{openModal && <Modal title="הוספת משחק" text={modalText} onClick={closeModalHandler} />}
				</>
			)}
		</>
	);
};

export default AddMatch;
