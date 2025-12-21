import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const GroupsHeader = () => {
	const { pathname } = useLocation();
	// Get the tournament
	const tournaments = useSelector((state) => state.tournaments.tournaments);
	// Get the entered tournamet
	const currentTournament = tournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	const tournamentName = currentTournament?.name || "";
	
	// check if the tournament is started, if started, we can't create a group
	const now = new Date().toISOString();
	const isStarted = currentTournament.startTime <= now;

	return (
		<>
			<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 text-center text-2xl font-bold mt-10 underline">{tournamentName}</h1>
			
			<header className="text-white mt-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:mt-4">
					<div className="flex justify-center">
						{/* Navigation Menu */}
						<nav className="flex justify-evenly items-center w-full text-md md:w-4/6">
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

							{/* Admin can create a new match(in case of knockout instead insert manually) */}
							{sessionStorage.getItem("isAdmin") === "true" && (
								<NavLink
									to="/layout/groups-layout/add-match"
									className={`hover:text-gray-300 transition-all ${
										pathname.includes("add-match")
											? "text-yellow-400 font-semibold hover:text-yellow-400"
											: ""
									}`}
								>
									הוסף משחק לטורניר
								</NavLink>
							)}
						</nav>
					</div>
				</div>
			</header>
		</>
	);
};

export default GroupsHeader;
