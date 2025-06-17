import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import dbConnection from "./config/mongo.js";
import matchWatch from "./collectionWatch/matchWatch.js";

import authentication from "./middleware/authentication.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/userRoute.js";
import groupRouter from "./routes/groupRoute.js";
import tounamentRouter from "./routes/tournamentsRoute.js";
// import matchRouter from "./routes/matchRouter.js";
// import betRouter from "./routes/betRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// body-parser is a built-in middleware function in Express after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.REACT_ADDRESS,
  credentials: true
}));

// Connect to DB
await dbConnection();

// First, let the user login or create a new account 
app.use("/auth", authRouter);

// Create io to send the function that treat in MatchWatch in DB for client update when I insert final score manually
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.REACT_ADDRESS,
		methods: ["GET", "POST"],
	},
});

// Util function to watch the Match collection(when I update manually the final score, it will send to client)
matchWatch(io);

// Middleware to check if the user logged and sent the token
app.use(authentication)
app.use("/tournament", tounamentRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
