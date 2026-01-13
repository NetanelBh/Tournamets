import { useSelector } from "react-redux";

import Table from "../../UI/table/Table";
import BetsLayout from "../layouts/BetsLayout";

const AllFriendsWinnerTeamsAndTopScorers = () => {
	const dataType = localStorage.getItem("showType");

	const allWinnerTeams = useSelector((state) => state.bets.allUsersWinnerTeams);
	const allTopScorers = useSelector((state) => state.bets.allUsersTopScorers);

	// After got the data, remove the localStorage for next use
	localStorage.removeItem("showType");

	// This is a list of objects, we need to pass it to Table component as list
	const winnerTeamRows = allWinnerTeams.map((row) => [row.username, row.winnerTeam]);
	const topScorerRows = allTopScorers.map((row) => [row.username, row.topScorer]);

	const allUsersBetsData = {
		headers: ["שם", "הימור"],
		rows: dataType === "winnerTeam" ? winnerTeamRows : topScorerRows,
	};

	return (
		<div className="flex flex-col items-center">
			<BetsLayout />

			{dataType === "winnerTeam" ? (
				<div className="text-center text-yellow-300 mb-4">הימורי הקבוצה הזוכה</div>
			) : (
				<div className="text-center text-yellow-300 mb-4">הימורי מלך השערים</div>
			)}

			<Table data={allUsersBetsData} />
		</div>
	);
};

export default AllFriendsWinnerTeamsAndTopScorers;
