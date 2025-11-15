import { useSelector } from "react-redux";

const Table = () => {
	const tournamentId = localStorage.getItem("tournamentId");
	const groupId = localStorage.getItem("groupId");

	// Get the current tournament
	const tournament = useSelector((state) => state.tournaments.tournaments.find((t) => t._id === tournamentId));
  // Get the current group points rules(calculate the points for the each user in the table and exact/directions bets)
	const groupPointsRules = useSelector((state) => state.user.user.groups.find((g) => g._id === groupId)).points;
	// Get all users bets for the current tournament - it's an object {matchId: [bets]}
	const allUsersBets = useSelector((state) => state.bets.allUsersBets);

	// TODO: WRITE A FUNCTION TO CALCULATE THE POINTS/EXACT/DIRECTIONS FOR EACH USER BY THE GROUP_POINTS_RULES AND HIS BETS
  // TODO: CREATE THE FUNCTION IN DIFFERENT FILE AND RETURN AN OBJECT WITH ALL DATA, THEN MAP THE <TR> FOR EACH USER

	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
					<div className="overflow-hidden">
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
								<tr className="border-b dark:border-neutral-500">
									<td className="whitespace-nowrap  px-4 py-4 font-medium dark:border-neutral-500">
										1
									</td>
									<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">Mark</td>
									<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">Otto</td>
									<td className=" px-4 py-4 dark:border-neutral-500">@mdo</td>
								</tr>
								<tr className="border-b dark:border-neutral-500">
									<td className="whitespace-nowrap  px-4 py-4 font-medium dark:border-neutral-500">
										2
									</td>
									<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">Jacob</td>
									<td className="whitespace-nowrap  px-4 py-4 dark:border-neutral-500">Thornton</td>
									<td className=" px-4 py-4 dark:border-neutral-500">@fat</td>
								</tr>
								<tr className="border-b dark:border-neutral-500">
									<td className="whitespace-nowrap  px-4 py-4 font-medium dark:border-neutral-500">
										3
									</td>
									<td className=" px-4 py-4 dark:border-neutral-500">Larry the Bird</td>
									<td className=" px-4 py-4 dark:border-neutral-500">@twitter</td>
									<td className=" px-4 py-4 dark:border-neutral-500">@twitter</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
