import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import "../../../App.css";

/* buttonText determine if the text will be join or enter(if came from alltournaments or mytournaments)*/
const TournamentsListItem = ({ item, index, btnText, onClick, leave = undefined }) => {
	const { pathname } = useLocation();
	const userTournaments = useSelector((state) => state.user.user.tournaments);

	const main_style = `relative overflow-hidden fade_up mb-3 group rounded-xl border-2 border-yellow-100/70`;

	// Get the current date as UTC(as stored in mongoDB)
	const now = new Date().toISOString();

	// Check if the user joined the tournament already
	const isJoined = userTournaments.includes(item._id);
	// Compate the dates to determine if the tournament is started

	let tournamentStatus = item.endDate < now ? "הסתיים" : false;
	if (!tournamentStatus) {
		tournamentStatus = item.startTime <= now ? "הטורניר התחיל" : "ניתן להצטרף";
	}
	let statusColor = "text-green-400 font-bold";
	if ((tournamentStatus === "הטורניר התחיל" || tournamentStatus === "הסתיים") && !isJoined) {
		statusColor = "text-red-500 font-bold";
	} else if (isJoined) {
		statusColor = "text-yellow-400 font-bold";
	}

	return (
		<li className={main_style} style={{ animationDelay: `${index * 0.15}s` }}>
			{/* This div is an overlay to the next div to make the item transparent */}
			<div className="absolute inset-0 bg-teal-600/60 group-hover:bg-cyan-900/10 transition duration-100 z-0"></div>
			<div className="px-4 py-4 sm:px-4 relative z-10">
				<div className="flex items-center justify-between h-16">
					<img src={item.symbol} alt="tournament symbol" style={{ width: "20%", height: "100%" }} />
					<p className="mt-1 max-w-2xl text-xl text-white font-medium">{item.name}</p>
				</div>
				<div className="mt-4 flex items-center justify-between">
					{/* Show the status only in AllTournaments page(כפתור כניסה זה רק עבור הטורנירים שלי) */}
					<p className={btnText !== "כניסה" ? "text-sm text-white" : "invisible"}>
						סטטוס :{" "}
						<span className={statusColor}>
							{isJoined && btnText !== "כניסה" ? "בטורנירים שלי" : tournamentStatus}
						</span>
					</p>

					<div className="flex flex-start gap-4">
						<button
							type="button"
							className={`text-white bg-red-700 hover:scale-95 active:scale-95 font-medium rounded-lg shadow-md shadow-gray-700 hover:shadow-sm hover:shadow-gray-400 text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:scale-95 cursor-pointer ${
								pathname.includes("all-tournaments")
									? "invisible"
									: ""
							}`}
							onClick={() => {
								leave(item._id);
							}}
						>
							עזיבה
						</button>

						<button
							className={`text-gray-900 bg-yellow-300 hover:scale-95 active:scale-95 font-medium rounded-lg shadow-md shadow-gray-700 hover:shadow-sm hover:shadow-gray-400 text-sm px-5 py-2.5 me-2 mb-2 dark:hover:scale-95 cursor-pointer ${
								(tournamentStatus === "הטורניר התחיל" || tournamentStatus === "הסתיים" || isJoined) &&
								btnText !== "כניסה"
									? "invisible"
									: ""
							}`}
							onClick={() => {
								localStorage.setItem("tournamentId", item._id);
								onClick();
							}}
						>
							{btnText}
						</button>
					</div>
				</div>
			</div>
		</li>
	);
};

export default TournamentsListItem;
