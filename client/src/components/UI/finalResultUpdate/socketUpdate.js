import { io } from "socket.io-client";
// Import store because is regular js function and we can't use useDiapatch hook
import {store} from "../../store/store";
import { matchesActions } from "../../store/slices/matchesSlice";

// Replace with your backend URL or environment variable
const SOCKET_URL = "http://localhost:3000";

const initSocketListener = () => {
	let socket;
	if (!socket) {
		socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
		});

		socket.on("connect", () => {
			console.log("Connected to socket server", socket.id);
		});

		// Listen for match updates
		socket.on("matchUpdated", (updatedMatch) => {
			// Dispatch update to Redux store
			store.dispatch(matchesActions.updateFinalResult(updatedMatch));
		});

		socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});
	}
};

export default initSocketListener;
