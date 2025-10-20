import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, createRef } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import MatchesList from "./MatchesList";
import Loading from "../../UI/loading/Loading";
import Dropdown from "../../UI/dropdown/Dropdown";
import { betsActions } from "../../store/slices/betSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { playersActions } from "../../store/slices/playersSlice";

const MyBets = () => {
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	// Ref list for the matches <input> when I want to create a request to send the bets
	const refs = useRef([]);

	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	const candidatesTopScorerPlayers = useSelector((state) => state.players.players);
	const bets = useSelector((state) => state.bets);
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
				// Get the topScorer and winnerTeam predictions from the DB
				const predictions = await API.post("/bets/get", { tournamentId, groupId });
				if (!predictions.data.status) {
					setModalText("אירעה שגיאה בטעינת הנתונים, אנא נסה שנית");
					return;
				}

				const allPredictions = [
					{ type: "dbTopScorer", data: predictions.data.data.topScorer },
					{ type: "dbWinnerTeam", data: predictions.data.data.winnerTeam },
					{ type: "dbScore", data: predictions.data.data.userBets },
				];

				dispatch(betsActions.load(allPredictions));
			} catch (error) {
				setModalText("אירעה שגיאה בטעינת הנתונים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPredictions();
	}, []);

	// Get the matches for the tournament
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

	const saveBetHandler = () => {
		notStartedMatches.forEach((match) => {
			// TODO: CREATE NEW LIST WITH NEW BETS(THOSE THAT THE USER DIDN'T BET BEFORE (create new bet))
			// TODO: CREATE A LIST WITH BETS THAT THEIR STATUS IS IN DB AND CHANGED (update)
			// const newBets = bets.dbScore.filter((bet) => bet.matchId !==)
			console.log(match);

			console.log(bets);
		});
	};

	// Check if the tournament started to display the top player and winner team bets
	const istournamentStarted = currentTourmanent.startTime > new Date().toISOString();

	// Data to dropdown compenent for the winner team
	const winnerTeamData = {
		dropdownHeader: "הקבוצה הזוכה",
		list: currentTourmanent.teams,
		currentChoice: bets.dbWinnerTeam,
		// When change the winner team, it will update the redux(to ba able to compare the db with the current)
		onClick: (team) => dispatch(betsActions.updateWinnerOrTopScorer({ type: "curWinnerTeamChoice", data: team })),
	};

	// Data to dropdown compenent for the top scorer players list
	const playersData = {
		dropdownHeader: "מלך השערים",
		list: candidatesTopScorerPlayers,
		currentChoice: bets.dbTopScorer,
		// When change the top scorer player, it will update the redux(to ba able to compare the db with the current)
		onClick: (player) =>
			dispatch(betsActions.updateWinnerOrTopScorer({ type: "curTopScorerChoice", data: player })),
	};

	// Filter only the matches that didn't start yet(to give the user the option to bet on them
	const notStartedMatchesData = matches.filter((match) => match.kickoffTime > new Date().toISOString());
	// Create an object from each element that contains the flag that the match didn't started yet for matchListItem component
	const notStartedMatches = notStartedMatchesData.map((match, i) => {
		if (!refs.current[i]) {
			// Create a new ref for each match: home and away teams
			refs.current[i] = { homeRef: createRef(), awayRef: createRef() };
		}

		const matchScoreBet = bets.dbScore.find((score) => score.matchId === match._id);
		// For each match, will add an extra property of the score bet from DB(if the user already bet, to show his bet)
		const newMatch = { ...match, matchScoreBet };

		return { ...newMatch, isStarted: false, refs: refs.current[i] };
	});

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
											{bets.dbWinnerTeam}
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
											{bets.dbTopScorer}
										</h3>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Not started matches list - for betting */}
					<MatchesList matches={notStartedMatches} />

					<footer
						className="border-t-4 border-r-4 border-l-4 border-red-600 shadow-inner shadow-gray-600 w-full text-center sm:w-3/9 fixed bottom-0 p-8 hover:py-10 active:py-10 hover:cursor-pointer active:cursor-pointer text-xl text-black font-bold bg-gray-700 rounded-tl-3xl rounded-tr-3xl"
						onClick={saveBetHandler}
					>
						<span className="bg-yellow-300 px-4 py-2 rounded-lg border-3 border-red-600">שמור תוצאות</span>
					</footer>

					{openModal && <Modal text={modalText} onClose={closeModalHandler} />}
				</>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
