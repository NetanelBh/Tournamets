import Match from "../models/match.js";

const matchWatch = (io) => {
	try {
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

		Match.watch().on("error", (error) => {
			console.log(error);
			setTimeout(matchWatch(io), 5000);
		});
	} catch (error) {
		  console.error('Unhandled ChangeStream error:', err);
	}
};

export default matchWatch;
