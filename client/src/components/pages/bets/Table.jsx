import API from "../../utils/Api";
import { useSelector } from "react-redux";
import { use, useEffect, useState } from "react";

import { usersPoints } from "./betsUtils";
import { tableColumns } from "./betsUtils";

import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = () => {
	const [usersTopScorer, setUsersTopScorer] = useState([]);
	const [usersWinnerTeam, setUsersWinnerTeam] = useState([]);
	const tournamentId = localStorage.getItem("tournamentId");
	const groupId = localStorage.getItem("groupId");

	// Fetch all users top scorer and winner team bets(only once)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [allUsersTopScorers, allUsersWinnerTeams] = await Promise.all([
					API.post("/topScorerBet/getAllByGroup", { tournamentId, groupId }),
					API.post("/winnerTeamBet/getAllByGroup", { tournamentId, groupId }),
				])

				setUsersTopScorer(allUsersTopScorers.data.data);
				setUsersWinnerTeam(allUsersWinnerTeams.data.data);
			} catch (error) {
				console.log(error);
				// TODO: CREATE A MODAL FOR THIS PAGE(BECAUSE USING PROMISE.ALL)
			}
		}

		fetchData();
	}, []);

	// Create an object with all required data to calculate the points from external function
	const data = {
		// Get all users to calculate the points in the table
		allUsers: useSelector((state) => state.user.allUsers),
		// Get all matches for the current tournament
		matches: useSelector((state) => state.matches.matches),
		// Get all users bets for the current tournament - it's an object {matchId: [bets]}
		usersBets: useSelector((state) => state.bets),
		// Get the current group points rules(calculate the points for the each user in the table and exact/directions bets)
		groupPointsRules: useSelector((state) => state.user.user.groups.find((g) => g._id === groupId)).points,
		// Get the current tournament to get the top scorer bonus and the winner team bonus
		tournamentTopScorerId: useSelector((state) => state.tournaments.tournaments.find((t) => t._id === tournamentId).topScorer),
		usersTopScorers: usersTopScorer,
		usersWinnerTeams: usersWinnerTeam,
	}

	// Sorted users points list to display in table
	const usersTableData = usersPoints(data);	

	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
					<div className="overflow-hidden">
						<table className="min-w-full border text-center text-xs font-light text-white dark:border-neutral-500">
							<TableHeader columns={tableColumns} />

							<tbody>
								{usersTableData.map((user, index) => (
									<TableRow key={index} user={user} index={index} columns={tableColumns} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
