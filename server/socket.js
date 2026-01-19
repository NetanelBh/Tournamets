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
		console.log("✅ Client connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("❌ Client disconnected:", socket.id);
		});
	});

	/* =========================
     Watch: matches collection
     ========================= */
	watchCollections({
		io,
		collectionName: "matches",
		events: {
			insert: (change, io) => {
				io.emit("matchAdded", change.fullDocument);
			},

			update: (change, io) => {
				const updated = change.updateDescription.updatedFields;
				if (updated.kickoffTime) {
					io.emit("kickoffTimeUpdated", change.fullDocument);
				} else {
					io.emit("finalScoreUpdated", change.fullDocument);
				}
			},
		},
	});

	/* ================================
     Watch: Tournaments collection - for the winner topScorer and winner team in the tournament
     ================================ */
	watchCollections({
		io,
		collectionName: "tournaments",
		events: {
			update: (change, io) => {
				const updated = change.updateDescription.updatedFields;				
				if (updated.topScorer) {
					io.emit("topScorerUpdated", {tournamentId: change.documentKey._id, data: updated.topScorer});
				} else {
					io.emit("winnerTeamUpdated", {tournamentId: change.documentKey._id, data: updated.winnerTeam});
				}
			},
		},
	});

	/* ================================
     Watch: Users collection - When tournament started and the user unpaid, need to update redux for the new group list
	 Or in case the user leave tournament, we want to update the new user tournaments list(because it fetch only once)
     ================================ */
	 watchCollections({
		io,
		collectionName: "users",
		events: {
			update: (change, io) => {
				const updated = change.updateDescription.updatedFields;		
				if (updated.groups) {
					io.emit("userGroups", updated);
				} else if(updated.tournaments) {
					io.emit("userTournaments", updated);
				}
			},
		},
	});
};

export default initSocket;
