import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Table from "../../UI/table/Table";
import Loading from "../../UI/loading/Loading";
import BetsLayout from "../layouts/BetsLayout";
import { finalScoreBackground } from "./betsUtils";
import { betsActions } from "../../store/slices/betSlice";

const FriendsBets = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [modalText, setModalText] = useState({});
	const [navigateTo, setNavigateTo] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const matchId = localStorage.getItem("matchId");
	// Get the user to know who is the current user between all the friends bet(want to write it in the table as "me")
	const currentUser = useSelector((state) => state.user.user);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);
	
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
				setModalText({ title: "תוצאות החברים", text: "שגיאה בטעינת התוצאות, אנא נסה שנית" });
				setNavigateTo("/layout/closed-bets");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllUsersBets();
	}, [matchId]);

	const closeModalHandler = () => {
		setOpenModal(false);
		navigate(navigateTo);
	};

	const bets = useSelector((state) => state.bets);
	
	// If is the first time we entered here, the all users bets list will not exist yet(useEffect run only at the end)
	const betsOfThisMatch = bets.allUsersBets[matchId] ? bets.allUsersBets[matchId] : [];	
	
	// Get the current match from the matches list to extract the match name
	const currentMatch = matches.find((match) => match._id === matchId);
	
	const allUsersBetsData = { headers: ["שם", "תוצאה", "ניחוש"], rows: [], colors: [] };

	allUsers.forEach((user) => {
		// Check if the user bet on this match
		const isBet = ""
		const row = [];
		let name = "אני";
		let score = "-";

		// If the iteration user isn't me, get the name from the user of the current iteration
		if (user._id !== currentUser._id) {
			name = user.username;
		}

		// If the current iteration user is in the users bets list, get the score(sometimes user doesn't bet on match)
		const currentIterationUserBet = betsOfThisMatch.find((bet) => bet.userId === user._id);
		if (currentIterationUserBet) {
			score = `${currentIterationUserBet.betScore.homeScore} : ${currentIterationUserBet.betScore.awayScore}`;
		}

		// For each user, find if his score is exact/direction/fail
		const userScore = {
			homeScore: currentIterationUserBet ? currentIterationUserBet.betScore.homeScore : -1,
			awayScore: currentIterationUserBet ? currentIterationUserBet.betScore.awayScore : -1,
		};
		const realScore = {
			homeScore: currentMatch.finalScore.homeScore,
			awayScore: currentMatch.finalScore.awayScore,
		};
		
		const betStatus = finalScoreBackground(userScore, realScore) + "-600";

		row.push(name);
		row.push(score);
		if(betStatus === "green-600") {
			row.push("בול");
		} else if (betStatus === "red-600") {
			row.push("נפילה");
		} else {
			row.push("כיוון");
		}

		allUsersBetsData.rows.push(row);
		
		// The user color in the table according to his bet: exact/direction/fail 
		allUsersBetsData.colors.push(betStatus);
	});

	// Sort the colors and rows arrays
	// Create a map of colors and their priority
	const colorsPriority = {"green-600": 0, "blue-600": 1, "red-600": 2};	
	// Combine the colors and rows arrays
	const combinedArrays = allUsersBetsData.colors.map((color, i) => ({color, rows: allUsersBetsData.rows[i]}));
	// Sort the combined arrays by the colors
	const sortedArrays = combinedArrays.sort((a, b) => colorsPriority[a.color] - colorsPriority[b.color]);

	// Update the rows and colors arrays
	allUsersBetsData.colors = sortedArrays.map((item) => item.color);
	allUsersBetsData.rows = sortedArrays.map((item) => item.rows);
	
	// Display the match name and the final score
	const matchData = (
		<h1 className="mb-4 mt-4 text-lg text-yellow-400">
			{currentMatch.homeTeam}{" "}
			<span className="text-white">
				( {currentMatch.finalScore.homeScore} ) - ( {currentMatch.finalScore.awayScore} ){" "}
			</span>
			{currentMatch.awayTeam}
		</h1>
	);

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<>
					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}

					{!openModal && (
						<div className="flex flex-col items-center">
							<BetsLayout />

							{matchData}
							<Table data={allUsersBetsData} />
						</div>
					)}
				</>
			)}
		</>
	);
};

export default FriendsBets;
