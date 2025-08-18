import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Input from "../../UI/input/Input";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import {createTournamentData} from "./tournamentUtils";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";

const CreateTournament = () => {
	const [isLoading, setIsLoading] = useState(false);
	const nameRef = useRef();
	const startDateRef = useRef();
	const endDateRef = useRef();
	const startTimeRef = useRef();
	const topScorerRef = useRef();
	const imgRef = useRef();
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	createTournamentData[0].ref = nameRef;
	createTournamentData[1].ref = startDateRef;
	createTournamentData[2].ref = endDateRef;
	createTournamentData[3].ref = startTimeRef;
	createTournamentData[4].ref = topScorerRef;
	createTournamentData[5].ref = imgRef;

	// When enter to some tournament, it keep the id in localStorage to case we will create group. in will other remove
	localStorage.removeItem("tournamentId");

	const createTournamentHandler = async (event) => {
		event.preventDefault();

		const newTournamentData = {
			name: nameRef.current.value,
			startDate: startDateRef.current.value,
			endDate: endDateRef.current.value,
			startTime: startTimeRef.current.value,
			isTopScorerIncluded: topScorerRef.current.value === "כן" ? true : false,
			imgUrl: imgRef.current.value,
		};

		setIsLoading(true);
		try {
			const resp = await API.post("/tournament/create", newTournamentData);

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
			setOpenModal(true);
			setModalText("אירעה שגיאה ביצירת הטורניר, אנא נסה שנית");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate("/layout/all-tournaments");
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
										defaultValue: "",
									};

									return <Input key={item.label} data={data}/>;
								})}
								<button
									className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg transition-colors"
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
