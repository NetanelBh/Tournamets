import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Input from "../../UI/input/Input";
import { joinGroupData } from "./groupUtils";
import Loading from "../../UI/loading/Loading";
import { userActions } from "../../store/slices/userSlice";

const JoinGroup = () => {
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const tournamentIs = localStorage.getItem("tournamentId");
	const nameRef = useRef();
	const codeRef = useRef();

	joinGroupData[0].ref = nameRef;
	joinGroupData[1].ref = codeRef;

	const joinGroupHandler = async (event) => {
		event.preventDefault();

		const newGroup = {
			groupName: nameRef.current.value,
			code: codeRef.current.value,
			tournamentId: tournamentIs,
		};

		setIsLoading(true);

		try {
			const resp = await API.post("/group/join", newGroup);

			setOpenModal(true);

			if (resp.data.status) {
				setNavigateTo("/layout/groups-layout/my-groups");
				setModalText("הצטרפת לקבוצה בהצלחה");
				// Update the redux - the data contains the joined group id
				dispatch(userActions.joinGroup(resp.data.data));
			} else {
				setModalText(resp.data.data);
				setNavigateTo("/layout/groups-layout/join-group");
			}
		} catch (error) {
			setOpenModal(true);
			setModalText("אירעה שגיאה בעת הצטרפות לקבוצה, אנא נסה שנית");
			setNavigateTo("/layout/groups-layout/join-group");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate(navigateTo);
	};

	return (
		<>
			{!openModal && (
				<>
					{isLoading && <Loading />}
					{!isLoading && (
						<div className="flex flex-col items-center p-4">
							<form
								className="fade_up max-w-md w-fit sm:w-full bg-cyan-900/90 rounded-xl shadow-lg p-6 mt-2 space-y-4 shadow-md shadow-gray-400"
								onSubmit={joinGroupHandler}
							>
								{joinGroupData.map((item) => {
									return <Input key={item.htmlFor} data={item} />;
								})}

								<div className="flex justify-end">
									<button className="w-1/4 bg-gradient-to-r from-teal-500 to-teal-800 shadow-sm shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg hover:shadow-sm transition-colors me-2 mb-2 mt-2">
										כניסה
									</button>
								</div>
							</form>
						</div>
					)}
				</>
			)}

			{openModal && <Modal title="הצטרפות לקבוצה" text={modalText} onClick={closeModalHandler} />}
		</>
	);
};

export default JoinGroup;
