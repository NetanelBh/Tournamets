import { Server } from "socket.io";
import watchCollections from "./watchCollectionsHelper.js";

const initSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "https://betsforfriends.vercel.app",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("Client connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id);
		});
	});

	// Watch the matches collection for real-time changes:
	watchCollections({
		io,
		collectionName: "matches",
		events: {
			insert: (change, io) => {
				io.emit("matchAdded", change.fullDocument);
			},
			update: (change, io) => {
				io.emit("finalScoreUpdated", change.fullDocument);
			},
		},
	});

	// Watch the winnerTeam collection for real-time changes:
	watchCollections({
		io,
		collectionName: "winnerteampredictions",
		events: {
			insert: (change, io) => {
				io.emit("winnerTeamAdded", change.fullDocument);
			},
			update: (change, io) => {
				io.emit("winnerTeamUpdated", change.fullDocument);
			},
		},
	});
};

export default initSocket;
