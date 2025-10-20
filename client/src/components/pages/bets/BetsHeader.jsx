import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const BetsHeader = () => {
	const { pathname } = useLocation();
	const tournaments = useSelector((state) => state.tournaments.tournaments);
	// Get the entered tournamet
	const currentTournament = tournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	// Get the tournament name
	const tournamentName = currentTournament?.name || "";
	
	const userGroups = useSelector((state) => state.user.user.groups);
	const groupName = userGroups.find((g) => g._id === localStorage.getItem("groupId"))?.name || "";

	return (
		<>
		{/* Tournament name */}
			<h1 className="text-center text-2xl font-bold text-white mt-10 underline">{tournamentName}</h1>
			<h2 className="text-center text-xl text-gray-400 mt-2">{groupName}</h2>

			<header className="text-white mt-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:mt-4">
					<div className="flex justify-center mb-6">
						{/* Navigation Menu */}
						<nav className="flex flex-col sm:flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10 text-xl items-center">
							<NavLink
								to="/layout/bets-layout/my-bets"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("my-bets")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								ההימורים שלי
							</NavLink>

							<NavLink
								to="/layout/bets-layout/closed-bets"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("closed-bets")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								הימורים סגורים
							</NavLink>

							<NavLink
								to="/layout/bets-layout/bets-table"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("bets-table")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								טבלה
							</NavLink>
						</nav>
					</div>
				</div>
			</header>
		</>
	);
};

export default BetsHeader;
