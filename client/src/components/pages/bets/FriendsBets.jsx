import API from "../../utils/Api";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchUserBets } from "./betsUtils";
import Table from "../../UI/table/Table";
import useFetch from "../../../hooks/useFetch";
import { betsActions } from "../../store/slices/betSlice";

// TODO: THE CUSTOM HOOK WILL GET AN FETCH API FUNCTION AS ARGUMENT TO USE IT INSIDE THE FETCH FUNCTION

const FriendsBets = () => {
	const dispatch = useDispatch();
	const matchId = localStorage.getItem("matchId");

	// Get the user to know who is the current user between all the friends bet(want to write it in the table as "me")
	const currentUser = useSelector((state) => state.user.user);
	const allUsers = useSelector((state) => state.user.allUsers);
	const matches = useSelector((state) => state.matches.matches);

	const { data, isLoading, error, fetchApi } = useFetch(fetchUserBets(matchId));

	// Fetch data only once per match that started already. Match that not stored in redux, will be fetched from the DB
	useEffect(() => {
		const fetchAllUsersBets = async () => {
			try {
				// TODO: CHECK THIS FUCTION AND FETCH - MAKE IT GENERIC WITH THE USEFETCH HOOK AND THE FUCTION FROM THE BETSUTILS
				// Fetch all users bet for the specific match(only if not fetched before)
				const usersBets = await fetchApi();
				
				dispatch(betsActions.load([{ type: "usersBetsForMatch", data: usersBets.data.data }]));
			} catch (error) {
				console.log(error);
			}

			fetchAllUsersBets();
		};
	}, [matchId]);

	const bets = useSelector((state) => state.bets);
	// If is the first time we entered here, the all users bets list will not exist yet(useEffect run only at the end)
	const betsOfThisMatch = bets.allUsersBets[matchId] ? bets.allUsersBets[matchId] : [];

	const allUsersBetsData = { headers: ["שם", "תוצאה"], rows: [] };

	allUsers.forEach((user) => {
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

		row.push(name);
		row.push(score);

		allUsersBetsData.rows.push(row);
	});

	// Get the current match from the matches list to extract the match name
	const currentMatch = matches.find((match) => match._id === matchId);
	const matchName = `${currentMatch.homeTeam} - ${currentMatch.awayTeam}`;

	return (
		<>
			<h1 className="mb-4 mt-4 text-lg text-yellow-400">{matchName}</h1>
			<Table data={allUsersBetsData} />
		</>
	);
};

export default FriendsBets;
