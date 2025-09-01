import { Outlet } from "react-router-dom";
import BetsHeader from "../bets/BetsHeader";
import { useSelector } from "react-redux";

const BetsLayout = () => {
	// Get the entire user's groups
	const userGroups = useSelector((state) => state.user.user.groups);
	// Extract only the current group
	const currentGroup = userGroups.find((g) => g._id === localStorage.getItem("groupId"));

	// TODO: CHECK HOW TO OPEN NEW TAB FOR THE PAYMENT WHEN CLICK ON THE PAYMENT BUTTON
	const now = new Date().toISOString();
	const tournamentId = localStorage.getItem("tournamentId");

	const tournament = useSelector((state) => state.tournaments.tournaments.find((t) => t._id === tournamentId));
	// Check if the tournament is started
	const isTournamentStarted = now > tournament.startTime;
	return (
		<div className="flex flex-col items-center">
			<BetsHeader />

			{/* Show only if the group defined with payment and if the tournament didn't start yet */}
			{!isTournamentStarted && currentGroup.isPaid && (
				<button
					className="mb-8 mt-4 w-full sm:w-1/4 bg-[#0018F9] shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:scale-95 active:shadow-sm text-white font-bold py-2.5 rounded-lg transition-colors"
					type="submit"
				>
					קישור לתשלום בפייבוקס
				</button>
			)}

			<Outlet />
		</div>
	);
};

export default BetsLayout;
