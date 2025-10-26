import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// The current and db properties are for comparing before sending redundant request to server
	dbTopScorer: null,
	curTopScorerChoice: null,
	dbWinnerTeam: null,
	curWinnerTeamChoice: null,
	dbScore: [],
	currentScore: [],
};

const betSlice = createSlice({
	initialState,
	name: "bets",
	reducers: {
		load(state, action) {
			action.payload.forEach((bet) => {
				// Create copy of the original db bets, make changes only on the copy
				if (bet.type === "dbScore") {
					state.dbScore = bet.data;
					state.currentScore = bet.data;
				} else if (bet.type === "dbTopScorer") {
					state.dbTopScorer = bet.data;
					state.curTopScorerChoice = bet.data;
				} else {
					state.dbWinnerTeam = bet.data;
					state.curWinnerTeamChoice = bet.data;
				}
			});
		},
		updateWinnerOrTopScorer(state, action) {
			// Get the type from the components(curWinnerTeamChoice, curTopScorerChoice).
			const { type, data } = action.payload;			
			state[type] = data;
		},
		placeBet(state, action) {
			// Find if the bet already exists by matchId, if so, change only the score. If not exist, is a new bet
			const matchIndex = state.currentScore.findIndex((match) => match.matchId === action.payload.matchId);			
			if (matchIndex !== -1) {
				state.currentScore[matchIndex].betScore = action.payload.betScore;
			} else {
				state.currentScore.push(action.payload);
			}
		},
		// Update the dbScore only when save matches results bets(to make it equal to DB new data)
		updateDbScore(state, action) {
			state.dbScore = action.payload;
		}
	},
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;
