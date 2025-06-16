import Match from "../models/match.js";

const matchWatch = (io) => {
	// Start watching Match collection
	Match.watch().on("change", async (change) => {
		if (
			change.operationType === "update" ||
			change.operationType === "replace" ||
			change.operationType === "insert"
		) {
			const matchId = change.documentKey._id;
			const updatedMatch = await Match.findById(matchId);
			if (updatedMatch) {
				// Send the update to the connected client
				io.emit("match-updated", updatedMatch);
			}
		}
		io.emit("match", change.fullDocument);
	});
};

export default matchWatch;
