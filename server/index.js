import "dotenv/config";
import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

import dbConnection from "./config/mongo.js";

import Match from "./models/matche.js";

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
        methods: ["GET", "POST"]
    }
})

// Start watching Match collection
const changeStream = Match.watch();
changeStream.on('change', async change => {
    if (change.prerationType === 'update' || change.operationType === 'replace') {
        const matchId = change.documentKey._id;
        const updatedMatch = await Match.findById(matchId);
        if (updatedMatch) {
            io.emit('match_updated', updatedMatch);
        }
    }
    io.emit('match', change.fullDocument);
})
dbConnection();

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
