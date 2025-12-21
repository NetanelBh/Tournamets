import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import GenericList from "../../UI/list/GenericList";
import { betsActions } from "../../store/slices/betSlice";
import { userActions } from "../../store/slices/userSlice";

const MyGroups = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// State to store the groupId if the user will decide to approve the exit(We need to use it in exitGroupHandler)
	const [groupId, setGroupId] = useState("");
	// This state determine if the modal ok button will be leave group or just close the modal
	const [isOkButton, setIsOkButton] = useState(false);
	const [modalText, setModalText] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Clear the bets in redux storage(in bets slice, the imformation stored per specific tournament and group)
	useEffect(() => {
		dispatch(betsActions.clear());
	}, [dispatch]);

	const userGroups = useSelector((state) => state.user.user.groups);
	const tournamentId = localStorage.getItem("tournamentId");
	const filtereGroups = userGroups.filter((group) => group.tournament === tournamentId);

	// When enter to some group in my groups list(specific for each tournament)
	const enterGroupHandler = (group) => {
		localStorage.setItem("groupId", group);
		navigate("/layout/my-bets");
	};

	// This function is called when we enter to myTournaments/myGroups, and I didn't join to any group yet.
	const joinGroup = () => {
		navigate("/layout/groups-layout/join-group");
	};

	const leaveGroupHandler = (group) => {
		setOpenModal(true);
		setModalText("יציאה מהקבוצה תגרום למחיקת כל ההימורים.\nהאם אתה בטוח? ");
		setGroupId(group);
	};

	// If the user click cancle after the leave group warning showed, just clear the modal
	const onCancleHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	const exitgroupHandler = async () => {
		setIsLoading(true);
		try {
			const user = await API.post("/user/leaveGroup", { tournamentId, groupId });

			// If we reached here, the user approved the exit, we want to create only ok button in the modal
			setIsOkButton(true);
			if (!user.data.status) {
				setOpenModal(true);
				setModalText("אירעה שגיאה בעת היציאה מהקבוצה, אנא נסה שנית");
				return;
			}

			// If the group removed from the user in DB, remove it also from redux
			dispatch(userActions.leaveGroup(groupId));
			setModalText("היציאה מהקבוצה בוצעה בהצלחה");
		} catch (error) {
			setModalText("אירעה שגיאה בעת היציאה מהקבוצה, אנא נסה שנית");
		} finally {
			setIsLoading(false);
		}
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
					{openModal && (
						<Modal
							title="הקבוצות שלי"
							text={modalText}
							onClick={!isOkButton ? exitgroupHandler : onCancleHandler}
							isExit={true}
							onCancle={onCancleHandler}
						/>
					)}
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
