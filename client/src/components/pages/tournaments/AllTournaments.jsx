import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/Api";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";
import { userActions } from "../../store/slices/userSlice";

import Modal from "../../errorModal/Modal";
import TournamentList from "../../UI/lists/tournament/TournamentList";
import { useNavigate } from "react-router-dom";

const AllTournaments = () => {
	const token = sessionStorage.getItem("token");
	const [modalText, setModalText] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const tournaments = useSelector((state) => state.tournaments.tournaments);


	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedTournaments = await API.get("/tournament/getAll", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				dispatch(tournamentsActions.load(fetchedTournaments.data.data));
			} catch (error) {
				setOpenModal(true);
			}
		};

		fetchData();
	}, []);

	const joinHandler = async (item) => {		
		setOpenModal(true);
		try {
			const resp = (
				await API.post(
					"/tournament/join",
					{ tournamentId: item._id },
					{ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
				)
			).data;

			if (resp.status) {				
				// Add the tournament to the user
				dispatch(userActions.joinTournament(item._id));
				const modalObj = {title: "הצטרפות לטורניר", text: "הצטרפת לטורניר בהצלחה"};
				setModalText({...modalObj});
				setNavigateTo("/layout/my-tournaments");
			} else {
				const modalObj = {title: "הצטרפת לטורניר", text: "אירעה שגיאה בהצטרפת לטורניר, אנא נסה שנית"};
				setModalText({...modalObj});
				setNavigateTo("/layout/all-tournaments");
			}
		} catch (error) {
			setModalText("אירעה שגיאה בהצטרפות לטורניר, אנא נסה שנית");
			setNavigateTo("/layout/all-tournaments");
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		navigate(navigateTo);
	};
	
	return (
		<>
			{!openModal && <TournamentList dataList={tournaments} btnText="הצטרף" onClick={joinHandler} />}
			{openModal && (
				<Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />
			)}
		</>
	);
};

export default AllTournaments;
