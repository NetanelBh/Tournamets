import topScorerModel from "../models/topScorerPrediction.js";

export const createTopScorer = (topScorer) => topScorerModel(topScorer).save();