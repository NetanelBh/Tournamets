import * as teamRepo from "../repos/playerRepo.js";

export const createPlayersCollection = (teamsArray) => {
    const playersObj = teamsArray.map((team) => {
        return { name: team };
    });
    
    return teamRepo.createPlayersCollection(playersObj);
};