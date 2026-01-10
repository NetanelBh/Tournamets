import { io } from "socket.io-client";
// Import store because is regular js function and we can't use useDiapatch hook
import { store } from "../../store/store";
import { matchesActions } from "../../store/slices/matchesSlice";
import { tournamentsActions } from "../../store/slices/tournamentsSlice";

const SOCKET_URL = import.meta.env.VITE_SERVER_URI;
let socket;
const initSocketListener = () => {
	if (socket) return;

	socket = io(SOCKET_URL, {
		transports: ["websocket", "polling"],
	});

	// Listen for match updates
	socket.on("matchAdded", (updatedMatch) => {
		// Dispatch update to Redux store
		store.dispatch(matchesActions.addMatch(updatedMatch));
	});

	socket.on("kickoffTimeUpdated", (match) => {		
		store.dispatch(matchesActions.kickoffTimeUpdate(match));
	});

	socket.on("finalScoreUpdated", (updatedMatch) => {				
		store.dispatch(matchesActions.updateFinalResult(updatedMatch));
	});

	socket.on("winnerTeamUpdated", (data) => {
		store.dispatch(tournamentsActions.updateTopPlayerOrWinnerTeam({ type: "winnerTeam", data }));
	});

	socket.on("topScorerUpdated", (data) => {
		store.dispatch(tournamentsActions.updateTopPlayerOrWinnerTeam({ type: "topScorer", data }));
	});

	socket.on("disconnect", () => {
		console.log("Socket disconnected");
	});
};

export default initSocketListener;
