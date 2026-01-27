import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, createRef } from "react";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import MatchesList from "./MatchesList";
import { saveButtonStyle } from "./betsUtils";
import Loading from "../../UI/loading/Loading";
import BetsLayout from "../layouts/BetsLayout";
import Dropdown from "../../UI/dropdown/Dropdown";
import SaveButton from "../../UI/saveButton/SaveButton";
import { betsActions } from "../../store/slices/betSlice";
import { userActions } from "../../store/slices/userSlice";
import { matchesActions } from "../../store/slices/matchesSlice";
import { playersActions } from "../../store/slices/playersSlice";

const MyBets = () => {
	// Remove the localStorage for top scorer and winner team friends bet
	localStorage.removeItem("showType");

	const navigate = useNavigate();
	const groupId = localStorage.getItem("groupId");
	const user = useSelector((state) => state.user.user);

	// In case the tournament started and the user sent out of tournament and he inside some page, redirect to muGroups
	const isUserExistInGroup = user.groups.some((g) => g._id === groupId);
	if (!isUserExistInGroup) {
		navigate("/layout/groups-layout/my-groups");
		return null;
	}

	// Clear the stored matchId(if stored)
	localStorage.removeItem("matchId");

	const dispatch = useDispatch();

	const [modalText, setModalText] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const [navigateTo, setNavigateTo] = useState("");

	const bets = useSelector((state) => state.bets);

	// User choices from dropdowns
	const [userWinnerTeamChoice, setUserWinnerTeamChoice] = useState(bets.dbWinnerTeam);
	const [userTopScorerChoice, setUserTopScorerChoice] = useState(bets.dbTopScorer);

	// State data for the SaveButton component
	const [saveStatus, setSaveStatus] = useState({});
	// To set timeout when saving the final score/winnerTeam/topScorer in DB to make it again save button
	const timeoutRef = useRef({});

	// Detect if the tournament is started(to run useEffect only once again to get the users after remove unpaid users)
	const istournamentStartedRef = useRef(false);
	const istopScorerAndWinnerTeamFetchedRef = useRef(false);

	// Ref list for the matches <input> when I want to create a request to send the bets
	const refs = useRef([]);

	const [isLoading, setIsLoading] = useState(false);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);
	// The clock from matchSlice(the clock update each second to make the components rerender for live matches bet list)
	const updatedClock = useSelector((state) => state.clock.now);
	// Get the topScorers with their id to send request to server when the user bet on the top socrer
	const topScorersList = useSelector((state) => state.players.players);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);

	const tournamentId = localStorage.getItem("tournamentId");
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === tournamentId);

	// Fetch the users from the DB only once. When stored in redux, we can use them everywhere in the application
	useEffect(() => {
		// if (allUsers.length > 0) return;
		setIsLoading(true);

		const fetchUsers = async () => {
			try {
				const tournamentId = localStorage.getItem("tournamentId");
				const groupId = localStorage.getItem("groupId");
				const users = await API.post("/user/allUsers", { tournamentId, groupId });
				if (!users.data.status) {
					setOpenModal(true);
					if (users.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
						setNavigateTo("/");
					} else {
						setModalText({
							title: "ההימורים שלי",
							text: "אירעה שגיאה בעת טעינת רשימת המשתמשים, אנא נסה שנית",
						});
						setNavigateTo("/layout/my-bets");
					}
					return;
				}

				dispatch(userActions.load({ type: "allUsers", data: users.data.data }));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בעת טעינת רשימת המשתמשים, אנא נסה שנית" });
				setNavigateTo("/layout/my-bets");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, [allUsers.length, dispatch]);

	useEffect(() => {
		const fetchUsers = async () => {
			// Reduce 5s to let the server remove the relevant unpaid users before fetch
			const cur = new Date(updatedClock);
			const delayTime = new Date(cur.getTime() - 1000 * 5);

			const kickoffTime = new Date(currentTourmanent.startTime);
			const isStarted = kickoffTime < delayTime;

			// The first time that the tournament is started, fetch the users(after the unpaid users are removed)
			if (isStarted && !istournamentStartedRef.current) {
				istournamentStartedRef.current = true;

				setIsLoading(true);
				try {
					const users = await API.post("/user/allUsers", { tournamentId, groupId });
					if (!users.data.status) {
						setOpenModal(true);
						if (users.data.data === "SESSION_EXPIRED") {
							setModalText({
								title: "זמן חיבור עבר",
								text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש",
							});
							setNavigateTo("/");
						} else {
							setModalText({
								title: "ההימורים שלי",
								text: "אירעה שגיאה בעת טעינת רשימת המשתמשים, אנא נסה שנית",
							});
							setNavigateTo("/layout/my-bets");
						}

						return;
					}

					dispatch(userActions.load({ type: "allUsers", data: users.data.data }));
				} catch (error) {
					setOpenModal(true);
					setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בעת טעינת רשימת המשתמשים, אנא נסה שנית" });
					setNavigateTo("/layout/my-bets");
				} finally {
					setIsLoading(false);
				}
			}

			// The first time that the tournament is started, fetch all users topScorer and winnerTeam bets (only once)
			if (isStarted && !istopScorerAndWinnerTeamFetchedRef.current) {
				istopScorerAndWinnerTeamFetchedRef.current = true;

				setIsLoading(true);
				try {
					// All users top scorers and winner teams
					const allUsersBets = await API.post("/user/topScorerWinnerTeamBets", { tournamentId, groupId });
					if (!allUsersBets.data.status) {
						setOpenModal(true);
						if (allUsersBets.data.data === "SESSION_EXPIRED") {
							setModalText({
								title: "זמן חיבור עבר",
								text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש",
							});
							setNavigateTo("/");
						} else {
							setModalText({ title: "ההימורים שלי", text: allUsersBets.data.data });
							setNavigateTo("/layout/my-bets");
						}
						return;
					}

					// Get all users winnerTeam bets
					const allUsersWinnerTeamBets = allUsersBets.data.data.map((user) => {
						return {
							username: user.username,
							winnerTeam: user.winnerTeam,
						};
					});

					// Get all users topScorer bets
					const allUsersTopScorerBets = allUsersBets.data.data.map((user) => {
						return {
							username: user.username,
							topScorer: user.topScorer,
						};
					});

					dispatch(
						betsActions.updateWinnerOrTopScorer({ type: "allUsersTopScorers", data: allUsersTopScorerBets })
					);
					dispatch(
						betsActions.updateWinnerOrTopScorer({
							type: "allUsersWinnerTeams",
							data: allUsersWinnerTeamBets,
						})
					);
				} catch (error) {
					setOpenModal(true);
					setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בקבלת הנתונים מהשרת, אנא נסה שנית" });
				} finally {
					setIsLoading(false);
				}
			}
		};

		fetchUsers();
	}, [dispatch, updatedClock, currentTourmanent]);

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
					setOpenModal(true);
					if (players.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
						setNavigateTo("/");
					} else {
						setModalText({
							title: "ההימורים שלי",
							text: "אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית",
						});
						setNavigateTo("/layout/my-bets");
					}

					return;
				}

				dispatch(playersActions.load(players.data.data));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בעת טעינת רשימת השחקנים, אנא נסה שנית" });
				setNavigateTo("/layout/my-bets");
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
					setOpenModal(true);
					if (predictions.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
						setNavigateTo("/");
					} else {
						setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בטעינת הנתונים, אנא נסה שנית" });
						setNavigateTo("/layout/my-bets");
					}

					return;
				}

				const allPredictions = [
					{ type: "dbTopScorer", data: predictions.data.data.topScorer },
					{ type: "dbWinnerTeam", data: predictions.data.data.winnerTeam },
					{ type: "userDbScore", data: predictions.data.data.userBets },
				];

				dispatch(betsActions.load(allPredictions));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בטעינת הנתונים, אנא נסה שנית" });
				setNavigateTo("/layout/my-bets");
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
					setOpenModal(true);
					if (matches.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
						setNavigateTo("/");
					} else {
						setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בטעינת המשחקים, אנא נסה שנית" });
						setNavigateTo("/layout/my-bets");
					}

					return;
				}

				dispatch(matchesActions.load(matches.data.data));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "אירעה שגיאה בטעינת המשחקים, אנא נסה שנית" });
				setNavigateTo("/layout/my-bets");
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

				if (!usersBets.data.status) {
					setOpenModal(true);
					if (usersBets.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
						setNavigateTo("/");
					} else {
						setModalText({ title: "ההימורים שלי", text: "שגיאה בטעינת תוצאות המשתמשים, אנא נסה שנית" });
						setNavigateTo("/layout/my-bets");
					}

					return;
				}

				dispatch(betsActions.load([{ type: "usersBetsForMatch", data: usersBets.data.data }]));
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "ההימורים שלי", text: "שגיאה בטעינת התוצאות, אנא נסה שנית" });
				setNavigateTo("/layout/my-bets");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllUsersBets();
	}, [dispatch]);

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText({});
		navigate(navigateTo);
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
			userId: user._id,
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
				if (resp.data.data === "SESSION_EXPIRED") {
					setOpenModal(true);
					setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
					setNavigateTo("/");
				} else {
					setSaveStatus((prev) => ({
						...prev,
						[match._id]: "נכשל",
					}));
				}
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
				[match._id]: "נכשל",
			}));
		} finally {
			timeoutRef.current[match._id] = setTimeout(() => {
				setSaveStatus((prev) => ({
					...prev,
					[match._id]: "שמור",
				}));
				delete timeoutRef.current[match._id];
			}, 3000);
		}
	};

	const saveWinnerTeamBetHandler = async () => {
		if (saveStatus["winnerTeam"] === "שומר") return;

		// In the first app load, userWinnerTeam is undefined. This case prevent save click onLoad without change team
		if (!userWinnerTeamChoice && bets.dbWinnerTeam) return;

		// If the user saved the same team, don't send any request to server
		if (userWinnerTeamChoice === bets.dbWinnerTeam) return;

		setSaveStatus((prev) => ({
			...prev,
			["winnerTeam"]: "שומר",
		}));
		try {
			const resp = await API.patch("/winnerTeamBet/updatePredict", {
				tournament: tournamentId,
				group: groupId,
				winnerTeamName: userWinnerTeamChoice,
			});

			if (!resp.data.status) {
				if (resp.data.data === "SESSION_EXPIRED") {
					setOpenModal(true);
					setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
					setNavigateTo("/");
				} else {
					setSaveStatus((prev) => ({
						...prev,
						["winnerTeam"]: "נכשל",
					}));
				}
			} else {
				setSaveStatus((prev) => ({
					...prev,
					["winnerTeam"]: "נשמר",
				}));

				dispatch(betsActions.updateWinnerOrTopScorer({ type: "dbWinnerTeam", data: userWinnerTeamChoice }));
			}
		} catch (error) {
			setSaveStatus((prev) => ({
				...prev,
				["winnerTeam"]: "נכשל",
			}));
		} finally {
			timeoutRef.current["winnerTeam"] = setTimeout(() => {
				setSaveStatus((prev) => ({
					...prev,
					["winnerTeam"]: "שמור",
				}));
				delete timeoutRef.current["winnerTeam"];
			}, 3000);
		}
	};

	const saveTopScorerBetHandler = async () => {
		if (saveStatus["topScorer"] === "שומר") return;

		// In the first app load, userWinnerTeam is undefined. This case prevent save click onLoad without change team
		if (!userTopScorerChoice && bets.dbTopScorer) return;

		// If the user saved the same topScorer, don't send any request to server
		if (userTopScorerChoice === bets.dbTopScorer) return;

		// Get the topScorer id to save in DB as topScorer bet
		const playerId = topScorersList.find((player) => player.name === userTopScorerChoice)._id;

		setSaveStatus((prev) => ({
			...prev,
			["topScorer"]: "שומר",
		}));
		try {
			const resp = await API.patch("/topScorerBet/updatePredict", {
				tournament: tournamentId,
				group: groupId,
				topScorer: playerId,
			});
			if (!resp.data.status) {
				if (resp.data.data === "SESSION_EXPIRED") {
					setOpenModal(true);
					setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
					setNavigateTo("/");
				} else {
					setSaveStatus((prev) => ({
						...prev,
						["topScorer"]: "נכשל",
					}));
				}
			} else {
				setSaveStatus((prev) => ({
					...prev,
					["topScorer"]: "נשמר",
				}));

				dispatch(betsActions.updateWinnerOrTopScorer({ type: "dbTopScorer", data: userTopScorerChoice }));
			}
		} catch (error) {
			setSaveStatus((prev) => ({
				...prev,
				["topScorer"]: "נכשל",
			}));
		} finally {
			timeoutRef.current["topScorer"] = setTimeout(() => {
				setSaveStatus((prev) => ({
					...prev,
					["topScorer"]: "שמור",
				}));
				delete timeoutRef.current["topScorer"];
			}, 3000);
		}
	};

	// Check if the tournament started to display the top player and winner team bets
	const istournamentStarted = currentTourmanent.startTime < updatedClock;

	// Data to dropdown compenent for the winner team
	const winnerTeamData = {
		dropdownHeader: "הקבוצה הזוכה",
		// Don't show the team that already chose by the user(appear in DB)
		list: currentTourmanent.teams.filter((team) => team !== bets.dbWinnerTeam),
		currentChoice: bets.dbWinnerTeam,
		// When change the winner team, it will update the redux(to ba able to compare the db with the current)
		onClick: (team) => setUserWinnerTeamChoice(team),
	};

	// Data to dropdown compenent for the top scorer players list
	const filteredList = topScorersList.filter((player) => player.name !== bets.dbTopScorer);
	// Extract only the name from the player object
	const candidatesForTopScorer = filteredList.map((player) => player.name);
	const playersData = {
		dropdownHeader: "מלך השערים",
		// Don't show the player that already chose by the user(appear in DB)
		list: candidatesForTopScorer,
		currentChoice: bets.dbTopScorer,
		// When change the top scorer player, it will update the redux(to ba able to compare the db with the current)
		onClick: (player) => setUserTopScorerChoice(player),
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

	// Create data for winner team save button
	const { style: winnerTeamSaveStyle, actionText: winnerTeamSaveText } = saveButtonStyle(
		saveStatus["winnerTeam"] || "שמור"
	);
	// Create data for top scorer save button
	const { style: topScorerSaveStyle, actionText: topScorerSaveText } = saveButtonStyle(
		saveStatus["topScorer"] || "שמור"
	);

	const friendsBetsHandler = (type) => {
		// type is topScorer / winnerTeam
		localStorage.setItem("showType", type);

		navigate("/layout/all-users-winnerteam-and-topscorer");
	};

	return (
		<>
			{!isLoading && (
				<div className="flex flex-col items-center">
					<BetsLayout />

					{!openModal && (
						<div className="flex flex-col mb-6">
							<div className="flex gap-8">
								<div className="flex flex-col gap-2 p-4 border border-yellow-100 w-40 sm:w-50 md:w-60">
									<h3 className="text-md text-yellow-100 text-center">האלופה :</h3>
									{/* Show the dropdown option only if the tournament didn't start */}
									{!istournamentStarted && (
										<>
											{/* Show the dropdown only when the tournament didn't start */}
											<div className="w-33 sm:w-40 md:w-50">
												<Dropdown data={winnerTeamData} />
											</div>

											<SaveButton
												status={saveStatus["winnerTeam"] || "שמור"}
												buttonText={winnerTeamSaveText}
												className={winnerTeamSaveStyle}
												onClick={saveWinnerTeamBetHandler}
											/>
										</>
									)}

									{/* Show the winner team when the tournament started */}
									{istournamentStarted && (
										<>
											<h3 className="p-2 text-sm text-black-400 text-center bg-yellow-100 font-bold rounded-lg">
												{bets.dbWinnerTeam ? bets.dbWinnerTeam : "-"}
											</h3>

											<div className="p-0.5 w-full bg-teal-700 text-yellow-300 text-sm flex justify-center mt-3 border border-white border-1 hover:cursor-pointer hover:scale-95 active:cursor-pointer active:scale-95 rounded-2xl">
												<button
													className="hover:cursor-pointer active:cursor-pointer"
													onClick={() => friendsBetsHandler("winnerTeam")}
												>
													הימורי החברים{" "}
													<span className="mr-1">
														<span className="blink_1">{">"}</span>
														<span className="blink_2">{">"}</span>
													</span>
												</button>
											</div>
										</>
									)}
								</div>

								{/* Show the topScorer dropdown only if the tournament defined to be with top scorer bet */}
								{currentTourmanent.topScorerBet && (
									<div className="flex flex-col gap-2 p-4 border border-yellow-100 w-40 sm:w-50 md:w-60">
										<h3 className="text-md text-yellow-100 text-center">מלך השערים :</h3>
										{!istournamentStarted && (
											<>
												{/* Show the dropdown only when the tournament didn't start */}
												<div className="w-33 sm:w-40 md:w-50">
													<Dropdown data={playersData} />
												</div>

												<SaveButton
													status={saveStatus["topScorer"] || "שמור"}
													buttonText={topScorerSaveText}
													className={topScorerSaveStyle}
													onClick={saveTopScorerBetHandler}
												/>
											</>
										)}

										{/* Show the winner team when the tournament started */}
										{istournamentStarted && (
											<>
												<h3 className="p-2 text-sm text-black-400 text-center bg-yellow-100 font-bold rounded-lg">
													{bets.dbTopScorer ? bets.dbTopScorer : "-"}
												</h3>

												<div className="p-0.5 w-full bg-teal-700 text-yellow-300 text-sm font-semi-bold flex justify-center mt-3 border border-white border-1 hover:cursor-pointer hover:scale-95 active:cursor-pointer active:scale-95 rounded-2xl">
													<button
														className="hover:cursor-pointer active:cursor-pointer"
														onClick={() => friendsBetsHandler("topScorer")}
													>
														הימורי החברים{" "}
														<span className="mr-1">
															<span className="blink_1">{">"}</span>
															<span className="blink_2">{">"}</span>
														</span>
													</button>
												</div>
											</>
										)}
									</div>
								)}
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
						<div className="text-red-500 font-bold text-xl mt-4">אין משחקים פתוחים להימור</div>
					)}

					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
				</div>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default MyBets;
