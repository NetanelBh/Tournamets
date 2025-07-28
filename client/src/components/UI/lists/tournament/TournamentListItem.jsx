import { useSelector } from "react-redux";

import "../../../../App.css";

const TournamentListItem = ({ item, index, btnText, onClick }) => {
	/* buttonText determine if the text will be join or enter(if came from alltournaments or mytournaments)*/

	const userTournaments = useSelector((state) => state.user.user.tournaments);

	const main_style = `fade_up border-gray-200 border rounded-lg mb-2 shadow bg-white`;

	// Create template from the same object Date
	const now = new Date();
	const startTime = item.startTime;

	// Check if the user joined the tournament already
	const isJoined = userTournaments.includes(item._id);
	// Compate the dates to determine if the tournament is started
	const tournamentStatus = startTime > now.toISOString() ? "הטורניר התחיל" : "ניתן להצטרף";
	let statusColor = "text-green-600";
	if (tournamentStatus === "הטורניר התחיל" || isJoined) {
		statusColor = "text-red-600";
	}

	return (
		<li className={main_style} style={{ animationDelay: `${index * 0.15}s` }}>
			<div className="px-4 py-4 sm:px-4">
				<div className="flex items-center justify-between h-16">
					<img src={item.symbol} alt="tournament symbol" style={{ width: "20%", height: "auto" }} />
					<p className="mt-1 max-w-2xl text-lg text-gray-800 font-medium">{item.name}</p>
				</div>
				<div className="mt-4 flex items-center justify-between">
					{/* Show the status only in AllTournaments page(כפתור כניסה זה רק עבור הטורנירים שלי) */}
					<p className={btnText !== "כניסה" ? "text-sm font-medium text-gray-500" : "invisible"}>
						סטטוס :{" "}
						<span className={statusColor}>
							{isJoined && btnText !== "כניסה" ? "אתה חבר בטורניר" : tournamentStatus}
						</span>
					</p>

					<button
						className={`px-4 w-fill bg-gray-700 hover:bg-gray-600 active:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors ${
							(tournamentStatus === "הטורניר התחיל" || isJoined) && btnText !== "כניסה" ? "invisible" : ""
						}`}
						onClick={onClick}
					>
						{btnText}
					</button>
				</div>
			</div>
		</li>
	);
};

export default TournamentListItem;
