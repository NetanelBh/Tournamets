import { Server } from "socket.io";
import mongoose from "mongoose";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "onlyfriendsbet.vercel.app",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", socket => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // WATCH the collections for real-time changes:
  const matchCollection = mongoose.connection.collection("matches");

  const changeStream = matchCollection.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", change => {
    if (change.operationType === "update" || change.operationType === "replace") {
      io.emit("matchUpdated", change.fullDocument);
    }
  });

  changeStream.on("error", (err) => {
    console.error("ChangeStream error:", err);
    console.log("Reconnecting change stream in 2 seconds...");
    setTimeout(initSocket, 2000); // auto-reconnect
  });
}

export default initSocket;
