import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// The current and db properties are for comparing before sending redundant request to server
	dbTopScorer: null,
	dbWinnerTeam: null,
	curTopScorerChoice: null,
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
				state[bet.type] = bet.data;
				if (bet.type === "dbScore") {
					state.dbScore = bet.data;
					state.currentScore = bet.data;
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
			console.log(matchIndex);
			
			if (matchIndex !== -1) {
				state.currentScore[matchIndex].betScore = action.payload.betScore;
			} else {
				state.currentScore.push(action.payload);
			}
		},
	},
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;
