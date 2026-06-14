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
	const updatedTime = useSelector((state) => state.clock.now);
	const isStarted = currentTournament.startTime <= updatedTime;

	return (
		<>
			<h1 className="text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 to-red-400 text-center text-2xl font-bold mt-10 underline">
				{tournamentName}
			</h1>

			<header className="text-white mt-6">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-5 sm:mt-4">
					<div className="flex justify-center">
						{/* Navigation Menu */}
						<nav className="flex justify-evenly items-center w-full text-md md:w-4/6 lg:w-1/2">
							<NavLink
								to="/layout/groups-layout/my-groups"
								className={`text-blue-600 font-semibold hover:text-blue-800 transition-all bg-yellow-200/90 p-1 rounded-md ${
									pathname.includes("my-groups")
										? "text-gray-800 font-semibold underline bg-yellow-500"
										: ""
								}`}
							>
								הקבוצות שלי
							</NavLink>

							<NavLink
								to="/layout/groups-layout/join-group"
								className={`text-blue-500 font-semibold hover:text-blue-700 transition-all bg-yellow-200/90 p-1 rounded-md ${
									pathname.includes("join-group")
										? "text-gray-800 font-semibold underline bg-yellow-500"
										: ""
								}`}
							>
								הצטרף לקבוצה
							</NavLink>

							{/* Only admin can create a group and add a match */}
							{sessionStorage.getItem("isAdmin") === "true" && (
								<>
									{/* Only if the tournament didn't start yet */}
									{!isStarted && (
										<NavLink
											to="/layout/groups-layout/create-group"
											className={`text-blue-500 font-semibold hover:text-blue-700 transition-all bg-yellow-200/90 p-1 rounded-md ${
												pathname.includes("create-group")
													? "text-gray-800 font-semibold underline bg-yellow-500"
													: ""
											}`}
										>
											צור קבוצה
										</NavLink>
									)}

									<NavLink
										to="/layout/groups-layout/add-match"
										className={`text-blue-500 font-semibold hover:text-blue-700 transition-all bg-yellow-200/90 p-1 rounded-md ${
											pathname.includes("add-match")
												? "text-gray-800 font-semibold underline bg-yellow-500"
												: ""
										}`}
									>
										הוסף משחק
									</NavLink>
								</>
							)}
						</nav>
					</div>
				</div>
			</header>
		</>
	);
};

export default GroupsHeader;
