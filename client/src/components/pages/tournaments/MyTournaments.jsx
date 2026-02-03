import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import GenericList from "../../UI/list/GenericList";
import { userActions } from "../../store/slices/userSlice";

const MyTournaments = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [tournamentId, setTournamentId] = useState("");
	// This state determine if the modal ok button will be leave group or just close the modal
	const [isOkButton, setIsOkButton] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	
	const myTournaments = useSelector((state) => state.user.user.tournaments);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);

	const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));

	// Run these lines only when we are enter to this page
	useEffect(() => {
		// When enter to some tournament, it keep the id in localStorage in case we will create group.
		localStorage.removeItem("tournamentId");
		localStorage.removeItem("groupId");
		localStorage.removeItem("matchId");
	}, [])

	const enterTournamentHandler = (id) => {
		setTournamentId(id);
		navigate("/layout/groups-layout/my-groups");
	};

	const leaveTournamentHandler = (id) => {
		setOpenModal(true);
		setModalText({title: "יציאה מטורניר", text: "יציאה מהטורניר תגרום למחיקת כל ההימורים.\nהאם אתה בטוח? "});
		setTournamentId(id);
	};

	const exitTournamentHandler = async () => {
		setIsLoading(true);
		setOpenModal(true);
		try {
			const resp = await API.delete(`/user/leaveTournament/${tournamentId}`);
			// If we reached here, the user approved the exit, we want to create only ok button in the modal
			setIsOkButton(true);
			// If the delete succeed, will remove it also from redux
			if (!resp.data.status) {
				if (resp.data.data === "SESSION_EXPIRED") {
					setModalText({title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש"});
				} else {
					setModalText({title: "הטורנירים שלי", text: "אירעה שגיאה, אנא התחבר שנית"});
				}
				
				setNavigateTo("/");
				return;
			}

			dispatch(userActions.leaveTournament(tournamentId));
			setModalText({title: "הטורנירים שלי", text: resp.data.data});
			setNavigateTo("/layout/my-tournaments");
		} catch (error) {
			setModalText({title: "שגיאה בשרת", text: error.message});
		} finally {
			setIsLoading(false);
		}
	};

	const joinTournamentHandler = () => {
		navigate("/layout/all-tournaments");
	};

	const onCancleHandler = () => {
		setOpenModal(false);
		setModalText({});
		navigate(navigateTo);
	};

	// send props object to generic list component
	const data = {
		dataList: filteredTournamets,
		btnText: "כניסה",
		onClick: enterTournamentHandler,
		leave: leaveTournamentHandler,
	};

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<>
					{openModal && (
						<Modal
							title={modalText.title}
							text={modalText.text}
							onClick={!isOkButton ? exitTournamentHandler : onCancleHandler}
							isExit={true}
							onCancle={onCancleHandler}
						/>
					)}
					{!openModal && (
						<>
							{filteredTournamets.length > 0 && <GenericList data={data} type="tournament" />}
							{filteredTournamets.length === 0 && (
								<Modal
									title={modalText.title}
									text="לא הצטרפת עדיין לאף טורניר"
									onClick={joinTournamentHandler}
								/>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default MyTournaments;
