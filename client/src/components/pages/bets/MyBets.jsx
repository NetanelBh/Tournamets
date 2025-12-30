import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, createRef } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import MatchesList from "./MatchesList";
import Loading from "../../UI/loading/Loading";
import BetsLayout from "../layouts/BetsLayout";
import Dropdown from "../../UI/dropdown/Dropdown";
import { betsActions } from "../../store/slices/betSlice";
import { userActions } from "../../store/slices/userSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { playersActions } from "../../store/slices/playersSlice";

const MyBets = () => {
	// Clear the stored matchId(if stored)
	localStorage.removeItem("matchId");
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [openModal, setOpenModal] = useState(false);

	// State data for the SaveButton component
	const [saveStatus, setSaveStatus] = useState({});
	// To set timeout when saving the final score in DB to make it again save button
	const timeoutRef = useRef(null);

	// Ref list for the matches <input> when I want to create a request to send the bets
	const refs = useRef([]);

	const bets = useSelector((state) => state.bets);

	const [isLoading, setIsLoading] = useState(false);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);
	// The clock from matchSlice(the clock update each second to make the components rerender for live matches bet list)
	const updatedClock = useSelector((state) => state.clock.now);
	const topScorersList = useSelector((state) => state.players.players);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);

	const userId = useSelector((state) => state.user.user._id);
	const tournamentId = localStorage.getItem("tournamentId");
	const groupId = localStorage.getItem("groupId");
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === tournamentId);
	// TODO: WHEN THE TOURNAMENT START, CALCULATE HERE THE TOTAL MONEY IN THE BANK

	// Fetch the users from the DB only once. When stored in redux, we can use them everywhere in the application
	useEffect(() => {
		// if (allUsers.length > 0) return;
		setIsLoading(true);

		const fetchUsers = async () => {
			try {
				const tournamentId = localStorage.getItem("tournamentId");
				const groupId = localStorage.getItem("groupId");
				const users = await API.post("/user/allUsers", { tournamentId, groupId });

				dispatch(userActions.load({ type: "allUsers", data: users.data.data }));
			} catch (error) {
				setOpenModal(true);
				setModalText("אירעה שגיאה בעת טעינת רשימת המשתמשים, אנא נסה שנית");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, [allUsers.length, dispatch]);
	// Variable to determine if the tournament has a top scorer bet
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

	// Get the specific user bets and predictions(winner team and top scorer) to update the relevant dropdown
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

	// Fetch data only once per match that started already. Match that not stored in redux, will be fetched from the DB
	useEffect(() => {
		const fetchAllUsersBets = async () => {
			setIsLoading(true);
			try {
				// Fetch all users bet for the specific match(only if not fetched before)
				const usersBets = await API.post("/bets/allUsersBets", {
					tournamentId: localStorage.getItem("tournamentId"),
					groupId: localStorage.getItem("groupId"),
				});

				dispatch(betsActions.load([{ type: "usersBetsForMatch", data: usersBets.data.data }]));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "שגיאה בטעינת התוצאות, אנא נסה שנית" });
				setNavigateTo("/layout/closed-bets");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllUsersBets();
	}, [dispatch]);

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	const saveBetHandler = async ({ match, homeScore, awayScore }) => {
		if (saveStatus[match._id] === "שומר") return;

		// Check if the user bet equal to the db bet, if so, don't send any request to the server
		const isBetExist = bets.userDbScore.some((bet) => bet.matchId === match._id);
		if (isBetExist) {
			if (
				match.matchScoreBet.betScore.homeScore === homeScore &&
				match.matchScoreBet.betScore.awayScore === awayScore
			) {
				return;
			}
		}

		setSaveStatus((prev) => ({
			...prev,
			[match._id]: "שומר",
		}));

		// Create an object with the userBet template to store in db and redux
		const userBetToSave = {
			tournamentId,
			groupId,
			userId,
			matchId: match._id,
			betScore: {
				homeScore,
				awayScore,
			},
		};

		try {
			const resp = await API.put("/bets/placeBet", {
				tournamentId,
				groupId,
				matchId: userBetToSave.matchId,
				bet: userBetToSave.betScore,
			});

			if (!resp.data.status) {
				setSaveStatus((prev) => ({
					...prev,
					[match._id]: "נכשל",
				}));
			} else {
				setSaveStatus((prev) => ({
					...prev,
					[match._id]: "נשמר",
				}));

				dispatch(betsActions.placeBet(userBetToSave));
			}
		} catch (error) {
			setSaveStatus((prev) => ({
				...prev,
				[match._id]: "נשמר",
			}));
		} finally {
			timeoutRef.current = setTimeout(() => {
				setSaveStatus((prev) => ({
					...prev,
					[match._id]: "שמור",
				}));
			}, 3000);
		}

		// TODO: CREATE A NEW FUNCTION AND BUTTON FOR SAVING ALSO THE TOP SCORER BET AND THE WINNER TEAM AND TREAT THE CHECK SEPARATELY
		// // Check if the user changed his topScorer predict or it's a new bet(if db data is null, he never bet before)
		// if (bets.dbTopScorer !== bets.curTopScorerChoice) {
		// 	setIsLoading(true);

		// 	const chosenPlayer = topScorersList.find((player) => player.name === bets.curTopScorerChoice);
		// 	// Need to update because there is an existing bet in DB
		// 	if (bets.dbTopScorer !== null) {
		// 		try {
		// 			const response = await API.patch("/topScorerBet/updatePredict", {
		// 				tournamentId,
		// 				groupId,
		// 				topScorerId: chosenPlayer._id,
		// 			});

		// 			if (!response.data.status) {
		// 				setOpenModal(true);
		// 				setModalText("אירעה שגיאה בשמירת מלך השערים, אנא נסה שנית");
		// 			}

		// 			// When update the topScorer, will change the dbTopScorer to the new DB data(instead fetch) in redux
		// 			dispatch(
		// 				betsActions.updateWinnerOrTopScorer({ type: "dbTopScorer", data: bets.curTopScorerChoice })
		// 			);
		// 		} catch (error) {
		// 			setOpenModal(true);
		// 			setModalText("אירעה שגיאה מלך השערים, אנא נסה שנית");
		// 		} finally {
		// 			setIsLoading(false);
		// 		}
		// 	} else {
		// 		// It's a new bet because the data in DB is null
		// 		try {
		// 			const response = await API.post("/topScorerBet/createPredict", {
		// 				tournamentId,
		// 				groupId,
		// 				topScorerId: chosenPlayer._id,
		// 			});

		// 			if (!response.data.status) {
		// 				setOpenModal(true);
		// 				setModalText("אירעה שגיאה בשמירת מלך השערים, אנא נסה שנית");
		// 			}
		// 		} catch (error) {
		// 			setOpenModal(true);
		// 			setModalText("אירעה שגיאה בשמירת הנתונים , אנא נסה שנית");
		// 		} finally {
		// 			setIsLoading(false);
		// 		}
		// 	}
		// }

		// // Check if the user changed his winnerTeam predict or it's a new bet(if db data is null, he never bet before)
		// if (bets.dbWinnerTeam !== bets.curWinnerTeamChoice) {
		// 	setIsLoading(true);

		// 	// Need to update because there is an existing bet in DB
		// 	if (bets.dbWinnerTeam !== null) {
		// 		try {
		// 			const response = await API.patch("/winnerTeamBet/updatePredict", {
		// 				tournamentId,
		// 				groupId,
		// 				winnerTeamName: bets.curWinnerTeamChoice,
		// 			});

		// 			if (!response.data.status) {
		// 				setOpenModal(true);
		// 				setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
		// 			}

		// 			// When update the winnerTeam, will change the dbWinTeam to the new DB data(instead fetch) in redux
		// 			dispatch(
		// 				betsActions.updateWinnerOrTopScorer({ type: "dbWinnerTeam", data: bets.curWinnerTeamChoice })
		// 			);
		// 		} catch (error) {
		// 			setOpenModal(true);
		// 			setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
		// 		} finally {
		// 			setIsLoading(false);
		// 		}
		// 	} else {
		// 		// It's a new bet because the data in DB is null
		// 		try {
		// 			const response = await API.post("/winnerTeamBet/createPredict", {
		// 				tournamentId,
		// 				groupId,
		// 				winnerTeamName: bets.curWinnerTeamChoice,
		// 			});

		// 			if (!response.data.status) {
		// 				setOpenModal(true);
		// 				setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
		// 			}
		// 		} catch (error) {
		// 			setOpenModal(true);
		// 			setModalText("אירעה שגיאה בשמירת הקבוצה הזוכה, אנא נסה שנית");
		// 		} finally {
		// 			setIsLoading(false);
		// 		}
		// 	}
		// }
	};

	// Check if the tournament started to display the top player and winner team bets
	const istournamentStarted = currentTourmanent.startTime < updatedClock;

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
	const notStartedMatchesData = matches.filter((match) => match.kickoffTime > updatedClock);

	// Create an object from each match
	const notStartedMatches = notStartedMatchesData
		.map((match, i) => {
			if (!refs.current[i]) {
				// Create a new ref for each match: home and away teams
				refs.current[i] = { homeRef: createRef(), awayRef: createRef() };
			}

			const matchScoreBet = bets.userDbScore.find((score) => score.matchId === match._id);
			// For each match, will add an extra property of the score bet from DB(if the user already bet, to show his bet)
			const newMatch = { ...match, matchScoreBet };

			return { ...newMatch, refs: refs.current[i] };
		})
		.sort((match1, match2) => new Date(match1.kickoffTime) - new Date(match2.kickoffTime));

	return (
		<>
			{!isLoading && (
				<div className="flex flex-col items-center">
					<BetsLayout />

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
											{bets.dbWinnerTeam ? bets.dbWinnerTeam : "-"}
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
											{bets.dbTopScorer ? bets.dbTopScorer : "-"}
										</h3>
									)}
								</div>
							</div>
						</div>
					)}

					{/* If there is at least one match to bet, render the matches list */}
					{notStartedMatches.length > 0 && (
						/* Not started matches list - for betting */
						<MatchesList
							matches={notStartedMatches}
							onClick={saveBetHandler}
							buttonStatus={saveStatus}
							actionText="שמור"
							user="regular"
						/>
					)}

					{/* If no matches open to bet, render a message */}
					{notStartedMatches.length === 0 && (
						<div className="text-white text-xl mt-4">אין משחקים פתוחים להימור</div>
					)}

					{openModal && (
						<Modal title="שמירת הימורים - חשוב מאוד!" text={modalText} onClick={closeModalHandler} />
					)}
				</div>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
