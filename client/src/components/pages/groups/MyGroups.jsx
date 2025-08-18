import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import GenericList from "../../UI/list/GenericList";
import { userActions } from "../../store/slices/userSlice";

const MyGroups = () => {
	const userGroups = useSelector((state) => state.user.user.groups);
	const tournamentId = localStorage.getItem("tournamentId");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");

	const filtereGroups = userGroups.filter((group) => group.tournament === tournamentId);

  // When enter to some group in my groups list(specific for each tournament)
	const enterGroupHandler = (groupId) => {
    // Store the groupId in localStorage to use it in the bets pages
    localStorage.setItem("groupId", groupId);
    navigate("/layout/bets-layout/my-bets")
  };

	// This function is called when we enter to myTournaments/myGroups, and I didn't join to any group yet.
  const joinGroup = () => {
		navigate("/layout/groups-layout/join-group");
	};

	const leaveGroupHandler = async (groupId) => {
		// TODO: CHECK THIS PART OF THE LEAVE GROUP
		setIsLoading(true);
		try {
			const user = await API.delete(`/user/leaveGroup/${groupId}`);

			setOpenModal(true);

			if (!user.data.status) {
				setModalText("אירעה שגיאה בעת היציאה מהקבוצה, אנא נסה שנית");
				return;
			}

			// If the group removed from the user in DB, remove it also from redux
			dispatch(userActions.leaveGroup(groupId));
			setModalText("יצאת מהקבוצה בהצלחה");
		} catch (error) {
			setModalText("אירעה שגיאה בעת היציאה מהקבוצה, אנא נסה שנית");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate("/layout/groups-layout/my-groups");
	};

	// send props object to generic list component
	const data = {
		dataList: filtereGroups,
		btnText: "כניסה",
		onClick: enterGroupHandler,
		leave: leaveGroupHandler,
	};

	return (
		<>
			{isLoading && <Loading />}
			{!isLoading && (
				<>
					{openModal && <Modal title="הקבוצות שלי" text={modalText} onClick={closeModalHandler} />}
					{!openModal && (
						<>
							{filtereGroups.length > 0 && <GenericList data={data} type="group" />}
							{filtereGroups.length === 0 && (
								<Modal title="הקבוצות שלי" text="לא הצטרפת עדיין לאף קבוצה" onClick={joinGroup} />
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default MyGroups;
