import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import WhatsAppButton from "../../UI/whatsppButton/WhatsAppButton";

const BetsHeader = () => {
	const [isCodeDisplay, setIsCodeDisplay] = useState(false);
	const navigate = useNavigate();

	const { pathname } = useLocation();
	const tournaments = useSelector((state) => state.tournaments.tournaments);
	// Get the entered tournamet
	const currentTournament = tournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	// Get the tournament name
	const tournamentName = currentTournament?.name || "";

	const user = useSelector((state) => state.user.user);

	const currentGroup = user.groups.find((g) => g._id === localStorage.getItem("groupId"));

	// const groupName = user.groups.find((g) => g._id === localStorage.getItem("groupId"))?.name || "";
	// Find if the current user is the group's owner(to determine if display the group code on his screen)
	const isGroupOwner = user.groups.some((g) => g.owner === user._id && currentGroup.name === g.name);

	const codeDisplay = () => {
		setIsCodeDisplay((prev) => !prev);
	};

	const pointsExplainHandler = () => {
		if (pathname.includes("bets-table")) {
			navigate("/layout/table-rank-explain");
		} else {
			navigate("/layout/points-explain");
		}
	};

	const whatsappMessage = `שם הקבוצה: *${currentGroup.name}*
הקוד לקבוצה: *${currentGroup.code}*`;

	return (
		<>
			{/* Tournament name */}
			<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 text-center text-2xl font-bold mt-10 underline">
				{tournamentName}
			</h1>

			{/* Group name */}
			<h2 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 text-center text-xl mt-2">
				{currentGroup.name}
			</h2>

			{/* Group code - available only for the group owner */}
			{isGroupOwner && (
				<div className="flex gap-2 mt-4">
					{/* Determine if need to display the group code - for group owner only */}
					<button
						className="bg-gray-500 text-yellow-300 px-4 py-2 rounded-full hover:cursor-pointer active:cursor-pointer"
						onClick={codeDisplay}
					>
						{isCodeDisplay ? currentGroup.code : "הצג את קוד הקבוצה"}
					</button>

					{/* If the group code is displayed, let the owner the option to share it on whatsapp */}
					{isCodeDisplay && <WhatsAppButton message={whatsappMessage} />}
				</div>
			)}

			{/* Explain the points calculation for the group and table rank */}
			{!pathname.includes("points-explain") && !pathname.includes("table-rank-explain") && (
				<div className="flex gap-2 mt-4">
					{/* Determine if need to display the group code - for group owner only */}
					<button
						className="bg-gray-500 text-yellow-300 px-4 py-2 rounded-full hover:cursor-pointer active:cursor-pointer"
						onClick={pointsExplainHandler}
					>
						{pathname.includes("bets-table") ? "הסבר שוברי שויון" : "הסבר חישוב הנקודות"}
					</button>
				</div>
			)}

			<header className="text-white mt-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:mt-4">
					<div className="flex justify-center mb-6">
						{/* Navigation Menu */}
						<nav className="flex md:flex-row space-y-4 md:space-y-0 md:space-x-10 text-lg items-center">
							<NavLink
								to="/layout/my-bets"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("my-bets")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								ההימורים שלי
							</NavLink>

							<NavLink
								to="/layout/closed-bets"
								className={`hover:text-gray-300 transition-all ${
									pathname.includes("closed-bets")
										? "text-yellow-400 font-semibold hover:text-yellow-400"
										: ""
								}`}
							>
								הימורים סגורים
							</NavLink>

							<NavLink
								to="/layout/bets-table"
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
