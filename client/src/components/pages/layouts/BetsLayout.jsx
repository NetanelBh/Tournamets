import { Outlet } from "react-router-dom";
import BetsHeader from "../bets/BetsHeader";
import { useSelector } from "react-redux";

const BetsLayout = () => {
	// TODO: ADD LINK TO PAYBOX WHEN CLICK ON THE BUTTON
	const now = new Date().toISOString();
	const tournamentId = localStorage.getItem("tournamentId");

	const tournament = useSelector((state) => state.tournaments.tournaments.find((t) => t._id === tournamentId));
	const isTournamentStarted = now > tournament.startTime;
	return (
		<div className="flex flex-col items-center">
			<BetsHeader />

			{!isTournamentStarted && (
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
