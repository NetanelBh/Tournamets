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
	
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const fetchedTournaments = await API.get("/tournament/getAll", {
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					},
				});

				dispatch(tournamentsActions.load(fetchedTournaments.data.data));
				setIsLoading(false);
			} catch (error) {
				setOpenModal(true);
			}
		};

		fetchData();
	}, []);

	const joinHandler = async (item) => {
		setOpenModal(true);
		setIsLoading(true);
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
				const modalObj = { title: "הצטרפות לטורניר", text: "הצטרפת לטורניר בהצלחה" };
				setModalText({ ...modalObj });
				setNavigateTo("/layout/my-tournaments");
			} else {
				const modalObj = { title: "הצטרפת לטורניר", text: "אירעה שגיאה בהצטרפת לטורניר, אנא נסה שנית" };
				setModalText({ ...modalObj });
				setNavigateTo("/layout/all-tournaments");
			}
			setIsLoading(false);
		} catch (error) {
			setModalText("אירעה שגיאה בהצטרפות לטורניר, אנא נסה שנית");
			setNavigateTo("/layout/all-tournaments");
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
					{!openModal && <GenericList data={data} />}
					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
				</>
			)}
			{isLoading && <Loading />}
		</>
	);
};

export default AllTournaments;
