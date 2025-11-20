import { useSelector } from "react-redux";

import { tableColumns } from "./betsUtils";
import { calculatePoints } from "./betsUtils";

import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = () => {
	const tournamentId = localStorage.getItem("tournamentId");
	const groupId = localStorage.getItem("groupId");

	// Get all users to calculate the points in the table
	const allUsers = useSelector((state) => state.user.allUsers);
	// Get all matches for the current tournament
	const matches = useSelector((state) => state.matches.matches);
	// Get all users bets for the current tournament - it's an object {matchId: [bets]}
	const allUsersBets = useSelector((state) => state.bets.allUsersBets);
	// Get the current group points rules(calculate the points for the each user in the table and exact/directions bets)
	const groupPointsRules = useSelector((state) => state.user.user.groups.find((g) => g._id === groupId)).points;
	// Get the current tournament
	const tournament = useSelector((state) => state.tournaments.tournaments.find((t) => t._id === tournamentId));

	// List of objects that contains the users bets data for all matches that finished
	const usersTableData = allUsers.map((user) => {
		const finalUserPoints = {
			username: user.username,
			exacts: 0,
			directions: 0,
			winnerTeamBonus: 0,
			topScorerBonus: 0,
			totalMatchesPoints: 0,
		};

		matches.forEach((match) => {
			// Each match iteration, will take the corresponding match in the allUsersBets matches(the key is matchId)
			const matchBets = allUsersBets[match._id];
			// If all users didn't bet on this match it will be undefined, and we want to avoid from errors
			if (matchBets) {
				// Check if the user has a bet for the current match
				const userBet = matchBets.find((bet) => bet.userId === user._id);
				if (userBet) {
					const userPoints = calculatePoints(
						match.stage,
						match.round,
						match.finalScore,
						userBet,
						groupPointsRules
					);

					// Only if exact or direction, add 1 to the statistics
					if (finalUserPoints[userPoints.resultType] !== undefined)
						finalUserPoints[userPoints.resultType] += 1;

					finalUserPoints.totalMatchesPoints += userPoints.matchPoints;
				}
			}
		});

		// console.log(finalUserPoints);
		// TODO: ADD CHECK FOR WINNER TEAM BONUS AND TOP SCORER BONUS

		return finalUserPoints;
	});

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
