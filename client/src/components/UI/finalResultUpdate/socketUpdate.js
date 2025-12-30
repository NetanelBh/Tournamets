import { io } from "socket.io-client";
// Import store because is regular js function and we can't use useDiapatch hook
import {store} from "../../store/store";
import { matchesActions } from "../../store/slices/matchesSlice";
import { betsActions } from "../../store/slices/betSlice";

const SOCKET_URL = import.meta.env.VITE_SERVER_URI;

const initSocketListener = () => {
	let socket;
	if (!socket) {
		socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
		});

		// Listen for match updates
		socket.on("matchAdded", (updatedMatch) => {
			// Dispatch update to Redux store
			store.dispatch(matchesActions.addMatch(updatedMatch));
		});

		socket.on("finalScoreUpdated", (updatedMatch) => {
			store.dispatch(matchesActions.updateFinalResult(updatedMatch));
		});

		socket.on("winnerTeamAdded", (updatedTeam) => {
			console.log(updatedTeam);
			
			store.dispatch(betsActions.updateWinnerOrTopScorer({type: "dbWinnerTeam", data: updatedTeam.winnerTeam}));
		})

		socket.on("winnerTeamUpdated", (updatedTeam) => {
			store.dispatch(betsActions.updateWinnerOrTopScorer({type: "dbWinnerTeam", data: updatedTeam.winnerTeam}));
		})

		socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});
	}
};

export default initSocketListener;
