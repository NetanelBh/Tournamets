import "dotenv/config";
import cors from "cors";
import http from "http";
import express from "express";

import initSocket from "./socket.js";
import dbConnection from "./config/mongo.js";

import authentication from "./middleware/authentication.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/userRoute.js";
import groupRouter from "./routes/groupRoute.js";
import playerRouter from "./routes/playerRoute.js";
import tounamentRouter from "./routes/tournamentsRoute.js";
import betsRouter from "./routes/betsRoute.js";
import winnerTeamRouter from "./routes/winnerTeamPredictRoute.js";
import topScorerPredictionRouter from "./routes/topScorerPredictRoute.js";
import matchRouter from "./routes/matchRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// body-parser is a built-in middleware function in Express after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.REACT_ADDRESS,
  credentials: true
}));

// HTTP server wrapper (required for socket.io)
const server = http.createServer(app);

// Connect to DB
await dbConnection();

// Initialize Socket.IO in a separate file
initSocket(server);

// First, let the user login or create a new account 
app.use("/auth", authRouter);

// Middleware to check if the user logged and sent the token
app.use(authentication)

app.use("/user", userRouter);
app.use("/bets", betsRouter);
app.use("/group", groupRouter);
app.use("/match", matchRouter);
app.use("/player", playerRouter);
app.use("/tournament", tounamentRouter);
app.use("/winnerTeamBet", winnerTeamRouter);
app.use("/topScorerBet", topScorerPredictionRouter);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
