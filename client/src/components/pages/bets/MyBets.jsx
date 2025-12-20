import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, createRef } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import MatchesList from "./MatchesList";
import Loading from "../../UI/loading/Loading";
import Dropdown from "../../UI/dropdown/Dropdown";
import { betsActions } from "../../store/slices/betSlice";
import { userActions } from "../../store/slices/userSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { playersActions } from "../../store/slices/playersSlice";

const MyBets = () => {
	// Clear the stored matchId(if stored)
	localStorage.removeItem("matchId");

	const dispatch = useDispatch();
	const [modalText, setModalText] = useState(
		"לאחר בחירת תוצאה, יש ללחוץ על כפתור 'עדכן'. לאחר כל העדכונים, חובה ללחוץ על כפתור 'שמור הימורים' בתחתית הדף"
	);
	const [openModal, setOpenModal] = useState(true);

	// Ref list for the matches <input> when I want to create a request to send the bets
	const refs = useRef([]);

	const bets = useSelector((state) => state.bets);
	const [isLoading, setIsLoading] = useState(false);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);
	const topScorersList = useSelector((state) => state.players.players);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);

	const groupId = localStorage.getItem("groupId");
	const tournamentId = localStorage.getItem("tournamentId");
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === tournamentId);

	// Fetch the users from the DB only once. When stored in redux, we can use them everywhere in the application
	useEffect(() => {
		if (allUsers.length > 0) return;
		setIsLoading(true);

		const fetchUsers = async () => {
			try {
				const tournamentId = localStorage.getItem("tournamentId");
				const groupId = localStorage.getItem("groupId");
				const users = await API.post("/user/allUsers", { tournamentId, groupId });

				dispatch(userActions.load({ type: "allUsers", data: users.data.data }));
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, [allUsers.length, dispatch]);

	const hasTopScorerBet = currentTourmanent?.topScorerBet;
	// Get the candidate players for the top scorer
	useEffect(() => {
		// Fetch the candidate players only if the tournament defined to be with top scorer bet
		if (!hasTopScorerBet) return;

		const fetchPlayers = async () => {
			setIsLoading(true);
			try {
				const players = await API.post("player/get", { tournamentId });

				if (!players.data.status) {
					setModalText("אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית");
					return;
				}

				dispatch(playersActions.load(players.data.data));
			} catch (error) {
				setModalText("אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPlayers();
	}, [hasTopScorerBet, dispatch, tournamentId]);

	// Get the user predictions(for tournament winner team and top scorer) to update the relevant dropdown
	useEffect(() => {
		// Fetch data only for app start and not when refresh the page(to avoid lose the bets before sent to server)
		if (bets.userDbScore.length > 0) return;

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
					{ type: "userDbScore", data: predictions.data.data.userBets },
				];

				dispatch(betsActions.load(allPredictions));
			} catch (error) {
				setModalText("אירעה שגיאה בטעינת הנתונים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPredictions();
	}, [bets.userDbScore.length, dispatch, tournamentId, groupId]);

	// Get the matches for the tournament
	useEffect(() => {
		const fetchMatches = async () => {
			setIsLoading(true);
			try {
				const matches = await API.post("match/getAll", { tournamentId });
				if (!matches.data.status) {
					setModalText("אירעה שגיאה בטעינת המשחקים, אנא נסה שנית");
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
	}, [dispatch, tournamentId]);

	// Get all users bets for the tournament and group only once(only what have in DB - not means that all users bets)
	useEffect(() => {
		// Fetch only once. Need this condition because when refresh, redux is persist but the useEffect run again
		if (bets.allUsersBets.length > 0) return;

		const fetchAllUsersBets = async () => {
			setIsLoading(true);
			try {
				// Fetch all users bet for the specific match(only if not fetched before)
				const usersBets = await API.post("/bets/allUsersBets", {
					tournamentId: localStorage.getItem("tournamentId"),
					groupId: localStorage.getItem("groupId"),
				});

				dispatch(betsActions.load([{ type: "allUsersBets", data: usersBets.data.data }]));
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllUsersBets();
	}, [bets.allUsersBets.length, dispatch]);

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	const saveBetHandler = async () => {
		// Check if the user changed his topScorer predict or it's a new bet(if db data is null, he never bet before)
		if (bets.dbTopScorer !== bets.curTopScorerChoice) {
			setIsLoading(true);

			const chosenPlayer = topScorersList.find((player) => player.name === bets.curTopScorerChoice);
			// Need to update because there is an existing bet in DB
			if (bets.dbTopScorer !== null) {
				try {
					const response = await API.patch("/topScorerBet/updatePredict", {
						tournamentId,
						groupId,
						topScorerId: chosenPlayer._id,
					});

					if (!response.data.status) {
						setOpenModal(true);
						setModalText("אירעה שגיאה בשמירת מלך השערים, אנא נסה שנית");
					}

					// When update the topScorer, will change the dbTopScorer to the new DB data(instead fetch) in redux
					dispatch(
						betsActions.updateWinnerOrTopScorer({ type: "dbTopScorer", data: bets.curTopScorerChoice })
					);
				} catch (error) {
					setOpenModal(true);
					setModalText("אירעה שגיאה מלך השערים, אנא נסה שנית");
				} finally {
					setIsLoading(false);
				}
			} else {
				// It's a new bet because the data in DB is null
				try {
					const response = await API.post("/topScorerBet/createPredict", {
						tournamentId,
						groupId,
						topScorerId: chosenPlayer._id,
					});

					if (!response.data.status) {
						setOpenModal(true);
						setModalText("אירעה שגיאה בשמירת מלך השערים, אנא נסה שנית");
					}
				} catch (error) {
					setOpenModal(true);
					setModalText("אירעה שגיאה בשמירת הנתונים , אנא נסה שנית");
				} finally {
					setIsLoading(false);
				}
			}
		}

		// Check if the user changed his winnerTeam predict or it's a new bet(if db data is null, he never bet before)
		if (bets.dbWinnerTeam !== bets.curWinnerTeamChoice) {
			setIsLoading(true);

			// Need to update because there is an existing bet in DB
			if (bets.dbWinnerTeam !== null) {
				try {
					const response = await API.patch("/winnerTeamBet/updatePredict", {
						tournamentId,
						groupId,
						winnerTeamName: bets.curWinnerTeamChoice,
					});

					if (!response.data.status) {
						setOpenModal(true);
						setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
					}

					// When update the winnerTeam, will change the dbWinTeam to the new DB data(instead fetch) in redux
					dispatch(
						betsActions.updateWinnerOrTopScorer({ type: "dbWinnerTeam", data: bets.curWinnerTeamChoice })
					);
				} catch (error) {
					setOpenModal(true);
					setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
				} finally {
					setIsLoading(false);
				}
			} else {
				// It's a new bet because the data in DB is null
				try {
					const response = await API.post("/winnerTeamBet/createPredict", {
						tournamentId,
						groupId,
						winnerTeamName: bets.curWinnerTeamChoice,
					});

					if (!response.data.status) {
						setOpenModal(true);
						setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
					}
				} catch (error) {
					setOpenModal(true);
					setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
				} finally {
					setIsLoading(false);
				}
			}
		}

		// Get only the matches that are new or the result is changed from the db
		// Create a map of the db bets(scores bets)
		const dbBets = new Map(bets.userDbScore.map((bet) => [bet.matchId, bet.betScore]));
		// Collect only either the new or updated bets
		const updatedOrNewBets = bets.userCurrentScore.filter((bet) => {
			const dbBet = dbBets.get(bet.matchId);
			// new bet
			if (!dbBet) return true;

			// changed bet
			return dbBet.homeScore !== bet.betScore.homeScore || dbBet.awayScore !== bet.betScore.awayScore;
		});

		// Send to server only if we have bets in array. If the array is empty, there are no new bets or bets changes
		if (updatedOrNewBets.length > 0) {
			setIsLoading(true);
			try {
				setOpenModal(true);
				const response = await API.put("bets/placeBets", { bets: updatedOrNewBets });
				if (!response.data.status) {
					setModalText("אירעה שגיאה בשמירת ההימורים, אנא נסה שנית");
				} else {
					setModalText(`${response.data.data} הימורים נשמרו בהצלחה`);
				}
			} catch (error) {
				setOpenModal(true);
				setModalText("אירעה שגיאה בשמירת ההימורים , אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}

			// After sent the results to server, will update the redux(userDbScore) because no there are new results there
			dispatch(betsActions.updateUserDbScore(bets.userCurrentScore));
		}
	};

	// Check if the tournament started to display the top player and winner team bets
	const istournamentStarted = currentTourmanent.startTime < new Date().toISOString();

	// Data to dropdown compenent for the winner team
	const winnerTeamData = {
		dropdownHeader: "הקבוצה הזוכה",
		// Don't show the team that already chose by the user(appear in DB)
		list: currentTourmanent.teams.filter((team) => team !== bets.curWinnerTeamChoice),
		currentChoice: bets.curWinnerTeamChoice,
		// When change the winner team, it will update the redux(to ba able to compare the db with the current)
		onClick: (team) => dispatch(betsActions.updateWinnerOrTopScorer({ type: "curWinnerTeamChoice", data: team })),
	};

	// Data to dropdown compenent for the top scorer players list
	const filteredList = topScorersList.filter((player) => player.name !== bets.curTopScorerChoice);
	// Extract only the name from the player object
	const candidatesForTopScorer = filteredList.map((player) => player.name);
	const playersData = {
		dropdownHeader: "מלך השערים",
		// Don't show the player that already chose by the user(appear in DB)
		list: candidatesForTopScorer,
		currentChoice: bets.curTopScorerChoice,
		// When change the top scorer player, it will update the redux(to ba able to compare the db with the current)
		onClick: (player) =>
			dispatch(betsActions.updateWinnerOrTopScorer({ type: "curTopScorerChoice", data: player })),
	};

	// Filter only the matches that didn't start yet(to give the user the option to bet on them
	const notStartedMatchesData = matches.filter((match) => match.kickoffTime > new Date().toISOString());
	// Create an object from each element that contains the flag that the match didn't started yet for matchListItem component
	const notStartedMatches = notStartedMatchesData
		.map((match, i) => {
			if (!refs.current[i]) {
				// Create a new ref for each match: home and away teams
				refs.current[i] = { homeRef: createRef(), awayRef: createRef() };
			}

			const matchScoreBet = bets.userCurrentScore.find((score) => score.matchId === match._id);
			// For each match, will add an extra property of the score bet from DB(if the user already bet, to show his bet)
			const newMatch = { ...match, matchScoreBet };

			return { ...newMatch, isStarted: false, refs: refs.current[i] };
		})
		.sort((match1, match2) => new Date(match1.kickoffTime) - new Date(match2.kickoffTime));

	return (
		<>
			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col mb-6">
							<div className="flex gap-8">
								<div className="flex flex-col gap-2">
									<h3 className="text-md text-yellow-100 text-center">האלופה :</h3>
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
									<h3 className="text-md text-yellow-100 text-center">מלך השערים :</h3>
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

					{/* If there is at least one match to bet, render the matches list */}
					{notStartedMatches.length > 0 && (
						<>
							{/* Not started matches list - for betting */}
							<MatchesList matches={notStartedMatches} />

							<footer
								className="border-t-4 border-r-4 border-l-4 border-red-600 shadow-inner shadow-gray-600 w-full text-center sm:w-3/9 fixed bottom-0 p-8 hover:py-10 active:py-10 active:cursor-pointer text-xl text-black font-bold bg-gray-700 rounded-tl-3xl rounded-tr-3xl"
								onClick={saveBetHandler}
							>
								<span className="hover:cursor-pointer active:bg-gray-800 active:text-yellow-300 bg-yellow-300 px-4 py-2 rounded-lg border-3 border-red-600">
									שמור הימורים
								</span>
							</footer>
						</>
					)}

					{/* If no matches open to bet, render a message */}
					{notStartedMatches.length === 0 && (
						<div className="text-white text-xl mt-4">אין משחקים פתוחים להימור</div>
					)}

					{openModal && <Modal title="שמירת הימורים" text={modalText} onClick={closeModalHandler} />}
				</>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
