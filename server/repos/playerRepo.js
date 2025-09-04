import PlayerModel from "../models/player.js";

export const createPlayer = (name) => {
	return PlayerModel.findOneAndUpdate({ name }, { $setOnInsert: { name } }, { upsert: true, new: true });
};

// TODO: CREATE GET FUCTION TO GET ALL PLAYERS
