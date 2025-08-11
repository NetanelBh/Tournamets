import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const GroupsHeader = () => {
	const { pathname } = useLocation();
	// Get the tournament to check if the tournament is started, if started, we can't create a group
	const tournaments = useSelector((state) => state.tournaments.tournaments);
	
	const currentTournament = tournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	
	const now = new Date().toISOString();
	const isStarted = currentTournament.startTime <= now;

	return (
		<header className="text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:mt-4">
				<div className="flex justify-center">
					{/* Navigation Menu */}
					<nav className="flex flex-col sm:flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10 text-lg items-center">
						<NavLink
							to="/layout/groups-layout/my-groups"
							className={`hover:text-gray-300 transition-all ${
								pathname.includes("my-groups")
									? "text-yellow-400 font-semibold hover:text-yellow-400"
									: ""
							}`}
						>
							הקבוצות שלי
						</NavLink>

						<NavLink
							to="/layout/groups-layout/join-group"
							className={`hover:text-gray-300 transition-all ${
								pathname.includes("join-group")
									? "text-yellow-400 font-semibold hover:text-yellow-400"
									: ""
							}`}
						>
							הצטרף לקבוצה
						</NavLink>

						{/* ONly admin can create a group and only if the tournament didn't start yet */}
						{sessionStorage.getItem("isAdmin") === "true" && !isStarted && (
							<NavLink
								to="/layout/groups-layout/create-group"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("create-group")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								צור קבוצה
							</NavLink>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default GroupsHeader;
