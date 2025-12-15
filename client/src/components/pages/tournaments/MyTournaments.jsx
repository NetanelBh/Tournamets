import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GenericList from "../../UI/list/GenericList";
import Modal from "../../modal/Modal";
import API from "../../utils/Api";
import Loading from "../../UI/loading/Loading";
import { userActions } from "../../store/slices/userSlice";
import { useState } from "react";

const MyTournaments = () => {
	const myTournaments = useSelector((state) => state.user.user.tournaments);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	const dispatch = useDispatch();

	const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));

	// When enter to some tournament, it keep the id in localStorage in case we will create group.
	localStorage.removeItem("tournamentId");
	localStorage.removeItem("groupId");
	localStorage.removeItem("matchId");

	const enterGroupHandler = () => {
		navigate("/layout/groups-layout/my-groups");
	};

	const leaveTournamentHandler = async (tournamentId) => {
		setIsLoading(true);
		try {
			const resp = await API.delete(`/user/leaveTournament/${tournamentId}`);

			// If the delete succeed, will remove it also from redux
			if (resp.data.status) {
				dispatch(userActions.leaveTournament(tournamentId));
			}

			setOpenModal(true);
			setModalText(resp.data.data);
			setNavigateTo("/layout/my-tournaments");
		} catch (error) {
			setModalText("אירעה שגיאה ביציאה מהטורניר, אנא נסה שנית");
			setOpenModal(true);
			navigate("/layout/my-tournaments");
		} finally {
			setIsLoading(false);
		}
	};

	// send props object to generic list component
	const data = {
		dataList: filteredTournamets,
		btnText: "כניסה",
		onClick: enterGroupHandler,
		leave: leaveTournamentHandler,
	};

	const joinTournamentHandler = () => {
		navigate("/layout/all-tournaments");
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
					{openModal && <Modal title="הטורנירים שלי" text={modalText} onClick={closeModalHandler} />}
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
