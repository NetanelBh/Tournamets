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
	const [modalText, setModalText] = useState({});
	const [navigateTo, setNavigateTo] = useState("");
	const [isLoading, setIsLoading] = useState(false);
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

			if (!resp.data.status) {
				if (resp.data.data === "SESSION_EXPIRED") {
					setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
				} else {
					setModalText({ title: "הצטרפות לקבוצה", text: resp.data.data });
				}
				
				setNavigateTo("/");
				return;
			}

			setNavigateTo("/layout/groups-layout/my-groups");
			setModalText({ title: "הצטרפות לקבוצה", text: "הצטרפת לקבוצה בהצלחה" });
			// Update the redux - the data contains the joined group id
			dispatch(userActions.joinGroup(resp.data.data));
		} catch (error) {
			setOpenModal(true);
			setModalText({ title: "הצטרפות לקבוצה", text: "אירעה שגיאה, אנא התחבר שנית" });
			setNavigateTo("/");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText({});
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

								<button
									className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg transition-colors"
									type="submit"
								>
									כניסה
								</button>
							</form>
						</div>
					)}
				</>
			)}

			{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
		</>
	);
};

export default JoinGroup;
