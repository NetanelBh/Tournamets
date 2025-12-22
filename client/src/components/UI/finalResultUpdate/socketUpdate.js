import { io } from "socket.io-client";
// Import store because is regular js function and we can't use useDiapatch hook
import {store} from "../../store/store";
import { matchesActions } from "../../store/slices/matchesSlice";

const SOCKET_URL = import.meta.env.VITE_SERVER_URI;

const initSocketListener = () => {
	let socket;
	if (!socket) {
		socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
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
