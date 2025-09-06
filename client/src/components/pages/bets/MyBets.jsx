import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Dropdown from "../../UI/Dropdown";
import Loading from "../../UI/loading/Loading";
import {playersActions} from "../../store/slices/playersSlice";

const MyBets = () => {
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	const candidatesTopScorerPlayers = useSelector((state) => state.players.players);

	const tournamentId = localStorage.getItem("tournamentId");
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === tournamentId);

	// Data to dropdown compenent for the winner team
	const winnerTeamData = {
		dropdownHeader: "הקבוצה הזוכה",
		list: currentTourmanent.teams,
	};

	// Data to dropdown compenent for the top scorer players list
	const playersData = {
		dropdownHeader: "מלך השערים",
		list: candidatesTopScorerPlayers,
	};

	useEffect(() => {
		const fetchPlayers = async () => {
			setIsLoading(true);
			try {
				const players = await API.post("player/get", { tournamentId });
        
				if (!players.data.status) {
					setModalText("אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית");
					return;
				}

        const playersNames = players.data.data.map((player) => player.name);
				dispatch(playersActions.load(playersNames));
			} catch (error) {
				setModalText("אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		// Fetch the candidate players only if the tournament defined to be with top scorer bet
		if (currentTourmanent.topScorerBet) {
			fetchPlayers();
		}
	}, []);

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	return (
		<>
			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col">
							<div className="flex gap-8">
								<Dropdown data={winnerTeamData} />

								{/* Show the topScorer dropdown only if the tournament defined to be with top scorer bet */}
								{currentTourmanent.topScorerBet && <Dropdown data={playersData} />}
							</div>
						</div>
					)}

					{openModal && <Modal text={modalText} onClose={closeModalHandler} />}
				</>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
