import TeamModel from "../models/team.js";

export const createPlayersCollection = (teamsData) => TeamModel.insertMany(teamsData);