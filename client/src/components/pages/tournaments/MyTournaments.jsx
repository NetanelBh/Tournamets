import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import GenericList from "../../UI/list/GenericList";
import { userActions } from "../../store/slices/userSlice";
import { loadingActions } from "../../store/slices/loadingSlice";
import { selectIsLoading } from "../../store/slices/loadingSlice";

const MyTournaments = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [tournamentId, setTournamentId] = useState("");
	// This state determine if the modal ok button will be leave group or just close the modal
	const [isOkButton, setIsOkButton] = useState(false);

	const isLoading = useSelector(selectIsLoading);

	
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
		setModalText("יציאה מהטורניר תגרום למחיקת כל ההימורים.\nהאם אתה בטוח? ");
		setTournamentId(id);
	};

	const exitTournamentHandler = async () => {
		dispatch(loadingActions.start());
		try {
			const resp = await API.delete(`/user/leaveTournament/${tournamentId}`);
			console.log(resp.data);
			
			// If we reached here, the user approved the exit, we want to create only ok button in the modal
			setIsOkButton(true);
			// If the delete succeed, will remove it also from redux
			if (!resp.data.status) {
				setOpenModal(true);
				setModalText(resp.data.data);
				return;
			}

			dispatch(userActions.leaveTournament(tournamentId));
			setModalText(resp.data.data);
		} catch (error) {
			setModalText(error.message);
			setOpenModal(true);
		} finally {
			dispatch(loadingActions.stop());;
			navigate("/layout/my-tournaments");
		}
	};

	const joinTournamentHandler = () => {
		navigate("/layout/all-tournaments");
	};

	const onCancleHandler = () => {
		setOpenModal(false);
		setModalText("");
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
							title="הטורנירים שלי"
							text={modalText}
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
									title="הטורנירים שלי"
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
