import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/Api";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";
import { userActions } from "../../store/slices/userSlice";

import Loading from "../../UI/loading/Loading";
import Modal from "../../modal/Modal";
import GenericList from "../../UI/list/GenericList";
import { useNavigate } from "react-router-dom";

const AllTournaments = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [modalText, setModalText] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const tournaments = useSelector((state) => state.tournaments.tournaments);

	// When enter to some tournament, keep the id in localStorage to case we will create a group. in other case remove
	localStorage.removeItem("tournamentId");
	localStorage.removeItem("groupId");

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const fetchedTournaments = await API.get("/tournament/getAll");
				dispatch(tournamentsActions.load(fetchedTournaments.data.data));
			} catch (error) {
				setOpenModal(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const joinHandler = async (item) => {
		// Prevent a scenario that the user enter to tournament after he started(when he didn't refresh the browser)
		const now = new Date().toISOString();
		if (now >= item.startTime) {
			setOpenModal(true);
			setModalText({ title: "הצטרפת לטורניר", text: "הטורניר החל, לא ניתן להצטרף יותר" });
			setNavigateTo("/layout/all-tournaments");
			return;
		}

		setOpenModal(true);
		setIsLoading(true);
		try {
			const resp = (await API.post("/tournament/join", { tournamentId: item._id })).data;

			if (resp.status) {
				// Add the tournament to the user
				dispatch(userActions.joinTournament(item._id));
				const modalObj = { title: "הצטרפות לטורניר", text: "הצטרפת לטורניר בהצלחה" };
				setModalText({ ...modalObj });
				setNavigateTo("/layout/my-tournaments");
			} else {
				const modalObj = { title: "הצטרפת לטורניר", text: "אירעה שגיאה בהצטרפת לטורניר, אנא נסה שנית" };
				setModalText({ ...modalObj });
				setNavigateTo("/layout/all-tournaments");
			}
		} catch (error) {
			setModalText("אירעה שגיאה בהצטרפות לטורניר, אנא נסה שנית");
			setNavigateTo("/layout/all-tournaments");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		navigate(navigateTo);
	};

	// send props object to generic list component
	const data = {
		dataList: tournaments,
		btnText: "הצטרף",
		onClick: joinHandler,
	};

	return (
		<>
			{!isLoading && (
				<>
					{!openModal && <GenericList data={data} type="tournament" />}
					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
				</>
			)}
			{isLoading && <Loading />}
		</>
	);
};

export default AllTournaments;
