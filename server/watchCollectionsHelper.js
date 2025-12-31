import mongoose from "mongoose";

const watchCollections = ({ io, collectionName, events }) => {
	const collection = mongoose.connection.collection(collectionName);

	const changeStream = collection.watch([], {
		fullDocument: "updateLookup",
	});

	console.log(`👀 Watching ${collectionName} collection`);

	changeStream.on("change", (change) => {		
		const handler = events[change.operationType];

		if (handler) {
			handler(change, io);
		}
	});

	changeStream.on("error", (error) => {
		console.error(`🔥 ChangeStream error on ${collectionName}:`, error);

		changeStream.close();

		// Auto-reconnect after failure
		setTimeout(() => {
			watchCollections({ io, collectionName, events });
		}, 2000);
	});

	return changeStream;
};

export default watchCollections;
