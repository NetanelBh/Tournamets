import { useSelector } from "react-redux";

import "../../../App.css";

const TournamentListItem = ({ item, index, btnText, onClick }) => {
	/* buttonText determine if the text will be join or enter(if came from alltournaments or mytournaments)*/

	const userTournaments = useSelector((state) => state.user.user.tournaments);

	const main_style = `relative overflow-hidden fade_up mb-3 group rounded-xl border-2 border-yellow-100/70`;

	// Create template from the same object Date
	const now = new Date();
	const startTime = item.startTime;

	// Check if the user joined the tournament already
	const isJoined = userTournaments.includes(item._id);
	// Compate the dates to determine if the tournament is started
	const tournamentStatus = startTime > now.toISOString() ? "הטורניר התחיל" : "ניתן להצטרף";
	let statusColor = "text-green-600";
	if (tournamentStatus === "הטורניר התחיל" || isJoined) {
		statusColor = "text-red-500";
	}

	return (
		<li className={main_style} style={{ animationDelay: `${index * 0.15}s` }}>
			{/* This div is an overlay to the next div to make the item transparent */}
			<div className="absolute inset-0 bg-cyan-900/60 group-hover:bg-cyan-900/10 transition duration-300 z-0"></div>
			<div className="px-4 py-4 sm:px-4 relative z-10">
				<div className="flex items-center justify-between h-16">
					<img src={item.symbol} alt="tournament symbol" style={{ width: "20%", height: "auto" }} />
					<p className="mt-1 max-w-2xl text-xl text-white font-medium">{item.name}</p>
				</div>
				<div className="mt-4 flex items-center justify-between">
					{/* Show the status only in AllTournaments page(כפתור כניסה זה רק עבור הטורנירים שלי) */}
					<p className={btnText !== "כניסה" ? "text-medium font-medium text-white" : "invisible"}>
						סטטוס :{" "}
						<span className={statusColor}>
							{isJoined && btnText !== "כניסה" ? "אתה חבר בטורניר" : tournamentStatus}
						</span>
					</p>

					<button
						className={`px-4 w-fill bg-yellow-200 text-black font-medium font-bold hover:scale-95 active:bg-yellow-200 py-2.5 rounded-lg transition-colors ${
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
