import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Input from "../../UI/input/Input";
import Loading from "../../UI/loading/Loading";
import { topScorers } from "./tournamentUtils";
import { isTopScorerIncluded } from "./tournamentUtils";
import { createTournamentData } from "./tournamentUtils";
import RadioButtonsArea from "../groups/points/RadioButtonsArea";
import { loadingActions } from "../../store/slices/loadingSlice";
import { selectIsLoading } from "../../store/slices/loadingSlice";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";

const CreateTournament = () => {
	const nameRef = useRef();
	const startDateRef = useRef();
	const endDateRef = useRef();
	const startTimeRef = useRef();
	const imgRef = useRef();
	const topScorersRef = useRef();

	// Modal states
	const [openModal, setOpenModal] = useState(true);
	const [modalText, setModalText] = useState("בעת יצירת הטורניר, יש ליצור את המשחקים ל DB");
	const [navigateTo, setNavigateTo] = useState("/layout/create-tournament");
	// State for topScorer bet
	const [topScorerBet, setTopScorerBet] = useState(false);
	const isLoading = useSelector(selectIsLoading);
	
	// Navigation
	const navigate = useNavigate();
	const dispatch = useDispatch();

	createTournamentData[0].ref = nameRef;
	createTournamentData[1].ref = startDateRef;
	createTournamentData[2].ref = endDateRef;
	createTournamentData[3].ref = startTimeRef;
	createTournamentData[4].ref = imgRef;

	// When enter to some tournament, it keep the id in localStorage to case we will create group. in will other remove
	localStorage.removeItem("tournamentId");
	localStorage.removeItem("groupId");

	const createTournamentHandler = async (event) => {
		event.preventDefault();

		const newTournamentData = {
			name: nameRef.current.value,
			startDate: startDateRef.current.value,
			endDate: endDateRef.current.value,
			startTime: startTimeRef.current.value,
			topScorerBet: topScorerBet,
			imgUrl: imgRef.current.value,
			topScorersList: topScorerBet ?topScorersRef.current.value.split(",") : "s"
		};

		dispatch(loadingActions.start());
		try {
			const resp = await API.post("/tournament/create", newTournamentData);

			setNavigateTo("/layout/all-tournaments");
			// Always open the modal for both cases if the tournament created or occurred an error
			setOpenModal(true);

			// If the resopnse is true, it means the tournament successfully created and will store in redux
			if (resp.data.status) {
				dispatch(tournamentsActions.addTournament(resp.data.data));
				setModalText("הטורניר נוצר בהצלחה");
			} else {
				setModalText(resp.data.data);
			}
		} catch (error) {
			setNavigateTo("/layout/all-tournaments");
			setOpenModal(true);
			setModalText("אירעה שגיאה ביצירת הטורניר, אנא נסה שנית");
		} finally {
			dispatch(loadingActions.stop());
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate(navigateTo);
	};

	return (
		<>
			{isLoading && <Loading />}
			
			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col items-center p-4">
							<form
								className="fade_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl shadow-lg p-6 mt-2 space-y-4 shadow-md shadow-gray-400"
								onSubmit={createTournamentHandler}
							>
								{createTournamentData.map((item) => {
									const data = {
										label: item.label,
										type: item.type,
										htmlFor: item.htmlFor,
										ref: item.ref,
										autoComplete: "off",
										placeholder: item.clue,
										defaultValue: item.defaultValue,
									};

									return <Input key={item.label} data={data} />;
								})}

								<RadioButtonsArea
									header="לכלול מלך שערים?"
									data={isTopScorerIncluded}
									check={topScorerBet}
									onChange={setTopScorerBet}
								/>
								{topScorerBet && (
									<Input data={{...topScorers, ref: topScorersRef, placeholder: topScorers.clue, defaultValue: ""}}/>
								)}

								<button
									className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg transition-colors"
									type="submit"
								>
									צור טורניר
								</button>
							</form>
						</div>
					)}

					{openModal && <Modal title="יצירת טורניר" text={modalText} onClick={closeModalHandler} />}
				</>
			)}
		</>
	);
};

export default CreateTournament;
