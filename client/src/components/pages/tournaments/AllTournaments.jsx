import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import GenericList from "../../UI/list/GenericList";
import { userActions } from "../../store/slices/userSlice";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";

const AllTournaments = () => {
	const [modalText, setModalText] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const updatedTime = useSelector((state) => state.clock.now);
	const tournaments = useSelector((state) => state.tournaments.tournaments);

	// When enter to some tournament, keep the id in localStorage to case we will create a group. in other case remove
	localStorage.removeItem("tournamentId");
	localStorage.removeItem("groupId");
	localStorage.removeItem("matchId");

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const fetchedTournaments = await API.get("/tournament/getAll");
				if (!fetchedTournaments.data.status) {
					setOpenModal(true);
					setModalText({ title: "שגיאה בשרת", text: "אירעה בעיה בטעינת הנתונים, אנא נסה שנית" });
					setNavigateTo("/");
					return;
				}

				dispatch(tournamentsActions.load(fetchedTournaments.data.data));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "שגיאה בשרת", text: "אירעה בעיה בשרת, אנא נסה שנית" });
				setNavigateTo("/layout/all-tournaments");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const torunamentJoin = "הצטרפות לטורניר";

	const joinHandler = async (item) => {
		// Prevent a scenario that the user enter to tournament after he started(when he didn't refresh the browser)
		if (updatedTime >= item.startTime) {
			setOpenModal(true);
			setModalText({ title: torunamentJoin, text: "הטורניר החל, לא ניתן להצטרף יותר" });
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
				const modalObj = { title: torunamentJoin, text: "הצטרפת לטורניר בהצלחה" };
				setModalText({ ...modalObj });
				setNavigateTo("/layout/my-tournaments");
			} else {
				const modalObj = { title: torunamentJoin, text: "אירעה שגיאה בהצטרפת לטורניר, אנא נסה שנית" };
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
					{!openModal && tournaments.length === 0 && (
						<p className="text-white text-center text-xl text-yellow-200 font-semi-bold mt-12">אין טורנירים פעילים להצגה</p>
					)}

					{!openModal && tournaments.length > 0 && <GenericList data={data} type="tournament" />}
					
					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
				</>
			)}
			{isLoading && <Loading />}
		</>
	);
};

export default AllTournaments;
