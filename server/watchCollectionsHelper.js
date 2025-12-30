import mongoose from "mongoose";

const watchCollection = ({ io, collectionName, events }) => {
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

  changeStream.on("error", (err) => {
    console.error("ChangeStream error:", err);
    console.log("Reconnecting change stream in 2 seconds...");
    setTimeout(initSocket, 2000); // auto-reconnect
  });

  return changeStream;
};

export default watchCollection;