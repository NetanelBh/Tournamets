import { useSelector } from "react-redux";
import { calculatePoints } from "./betsUtils";

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
					// console.log(match);
					// console.log(groupPointsRules);
					// console.log(tournament);
					// console.log(userBet);

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
	// TODO: SORT THE LIST BY TOTAL POINTS. IF THERE IS MORE THAN 1 USER WITH THE SAME POINTS, SORT BY EXACTS, THEN BY DIRECTIONS

	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
					<div className="overflow-hidden">
						// TODO: CREATE TABLE ROW COMPONENT THAT RETURN ALL THE th TAG AND HERE JUST CALL IT
						<table className="min-w-full border text-center text-xs font-light text-white dark:border-neutral-500">
							<thead className="border-b font-medium dark:border-neutral-500">
								<tr>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										#
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										שם
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										מדויק
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										כיוון
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										בונוס אלופה
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										בונוס מלך שערים
									</th>
									<th scope="col" className="px-4 py-2 dark:border-neutral-500">
										סה"כ
									</th>
								</tr>
							</thead>
							<tbody>
								{usersTableData.map((user, index) => (
									// TODO: CREATE TABLE ROW COMPONENT THAT RETURN ALL THE <TD></TD> AND HERE JUST CALL IT
									<tr key={index} className="border-b dark:border-neutral-500">
										<td className="whitespace-nowrap  px-4 py-4 font-medium dark:border-neutral-500">
											{index + 1}
										</td>
										<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500 font-bold">
											{user.username}
										</td>
										<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">
											{user.exacts}
										</td>
										<td className=" px-4 py-4 dark:border-neutral-500">{user.directions}</td>
										<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">
											{user.winnerTeamBonus}
										</td>
										<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">
											{user.topScorerBonus}
										</td>
										<td className=" px-4 py-4 dark:border-neutral-500">
											{user.totalMatchesPoints}
										</td>
									</tr>
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
