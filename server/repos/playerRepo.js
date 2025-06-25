import PlayerModel from "../models/player.js";

export const createPlayersCollection = (playersData) => PlayerModel.insertMany(playersData);