import * as playerRepo from "../repos/playerRepo.js";

export const createPlayersCollection = (playersArray) => {
	const playersObj = playersArray.map((player) => {
		return { name: player };
	});
    
	return playerRepo.createPlayersCollection(playersObj);
};
