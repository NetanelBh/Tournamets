import * as playerRepo from "../repos/playerRepo.js";

export const createPlayer = (name) => {
	return playerRepo.createPlayer(name);
};

// TODO: CREATE GET FUCTION TO GET ALL PLAYERS