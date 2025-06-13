import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import dbConnection from "./config/mongo.js";

import Match from "./models/match.js";

import authRouter from "./routes/auth.js";
// import userRouter from "./routes/user.js";
// import matchRouter from "./routes/match.js";
// import betRouter from "./routes/bet.js";

const app = express();
const PORT = process.env.PORT || 3000;

// body-parser is a built-in middleware function in Express after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.REACT_ADDRESS,
		methods: ["GET", "POST"],
	},
});

// Connect to DB
await dbConnection();

// // Formula to check if the match is started
// const match = (await Match.find())[1];
// console.log(match.kickoffTime);
// console.log(new Date())

// Start watching Match collection
Match.watch().on("change", async (change) => {
	if (change.operationType === "update" || change.operationType === "replace" || change.operationType === "insert") {
		const matchId = change.documentKey._id;
		const updatedMatch = await Match.findById(matchId);
        if (updatedMatch) {
			console.log(updatedMatch);

			io.emit("match-updated", updatedMatch);
		}
	}
	io.emit("match", change.fullDocument);
});

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
