import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";
import Dropdown from "../../UI/dropdown/Dropdown";
import GenericList from "../../UI/list/GenericList";
import { userActions } from "../../store/slices/userSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { playersActions } from "../../store/slices/playersSlice";

const MyBets = () => {
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	const candidatesTopScorerPlayers = useSelector((state) => state.players.players);
	const user = useSelector((state) => state.user);
	const matches = useSelector((state) => state.matches.matches);

	const groupId = localStorage.getItem("groupId");
	const tournamentId = localStorage.getItem("tournamentId");
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === tournamentId);

	// Get the candidate players for the top scorer
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

	// Get the user predictions(for tournament winner team and top scorer) to update the relevant dropdown
	useEffect(() => {
		const fetchPredictions = async () => {
			setIsLoading(true);
			try {
				const predictions = await API.post("predictions", { tournamentId, groupId });
				if (!predictions.data.status) {
					setModalText("אירעה שגיאה בטעינת הנתונים, אנא נסה שנית");
					return;
				}
				dispatch(userActions.load({ type: "dbTopScorer", data: predictions.data.data.topScorer }));
				dispatch(userActions.load({ type: "dbWinnerTeam", data: predictions.data.data.winnerTeam }));
			} catch (error) {
				setModalText("אירעה שגיאה בטעינת הנתונים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPredictions();
	}, []);

	useEffect(() => {
		const fetchMatches = async () => {
			setIsLoading(true);
			try {
				const matches = await API.post("match/getAll", { tournamentId });
				if (!matches.data.status) {
					setModalText("אירעה שגיאה בטעינת השחקנים, אנא נסה שנית");
					return;
				}

				dispatch(matchesActions.load(matches.data.data));
			} catch (error) {
				setModalText("אירעה שגיאה בטעינת המשחקים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMatches();
	}, [modalText]);

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	// Check if the tournament started to display the top player and winner team bets
	const istournamentStarted = currentTourmanent.startTime > new Date().toISOString();

	// Data to dropdown compenent for the winner team
	const winnerTeamData = {
		dropdownHeader: "הקבוצה הזוכה",
		list: currentTourmanent.teams,
		currentChoice: user.dbWinnerTeam,
		// TODO: ADD SAVE HANDLER FUNCTION TO HANDLE THE USER CHOICE WHEN HE SAVE THE TOPSCORER
	};

	// Data to dropdown compenent for the top scorer players list
	const playersData = {
		dropdownHeader: "מלך השערים",
		list: candidatesTopScorerPlayers,
		currentChoice: user.dbTopScorer,
		// TODO: ADD SAVE HANDLER FUNCTION TO HANDLE THE USER CHOICE WHEN HE SAVE THE WINNER TEAM
	};

	// Create the object with the data that matches for generic list component
	const notStartedMatchesData = {
		// Filter only the matches that didn't start yet(to give the user the option to bet on them)
		dataList: matches.filter((match) => match.kickoffTime > new Date().toISOString()),
	};

	return (
		<>
			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col">
							<div className="flex gap-8">
								<div className="flex flex-col gap-2">
									<h3 className="text-md text-yellow-400 text-center">האלופה :</h3>
									{/* Show the dropdown option only if the tournament didn't start */}
									{!istournamentStarted && <Dropdown data={winnerTeamData} />}
									{/* Show the winner team when the tournament started */}
									{istournamentStarted && (
										<h3 className="p-2 text-md text-black-400 text-center bg-yellow-100 font-bold rounded-lg">
											{user.dbWinnerTeam}
										</h3>
									)}
								</div>

								<div className="flex flex-col gap-2">
									<h3 className="text-md text-yellow-400 text-center">מלך השערים :</h3>
									{/* Show the topScorer dropdown only if the tournament defined to be with top scorer bet */}
									{currentTourmanent.topScorerBet && !istournamentStarted && (
										<Dropdown data={playersData} />
									)}
									{/* Show the winner team when the tournament started */}
									{currentTourmanent.topScorerBet && istournamentStarted && (
										<h3 className="p-2 text-md text-black-400 text-center bg-yellow-100 font-bold rounded-lg">
											{user.dbTopScorer}
										</h3>
									)}
								</div>

							</div>
						</div>
					)}

					{/* Not started matches list - for betting */}
					<GenericList data={notStartedMatchesData} type="matches" />

					<footer className="w-full text-center sm:w-1/4 fixed bottom-0 p-6 hover:py-8 active:py-8 hover:cursor-pointer active:cursor-pointer text-black font-bold bg-yellow-300 rounded-tl-3xl rounded-tr-3xl">
						שמור שינויים
					</footer>

					{openModal && <Modal text={modalText} onClose={closeModalHandler} />}
				</>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
