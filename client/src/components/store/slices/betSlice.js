import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// The current and db properties are for comparing before sending redundant request to servet
	dbTopScorer: null,
	dbWinnerTeam: null,
	curTopScorerChoice: null,
	curWinnerTeamChoice: null,
	dbScore: [],
	currentScore: [],
	betStatus: null,
};

const betSlice = createSlice({
	initialState,
	name: "bets",
	reducers: {
		load(state, action) {
			action.payload.forEach((bet) => {
				state[bet.type] = bet.data;
                // Means that the bet already placed in DB, when save new bet, will check if exist in db
                state.betStatus = "exist in db";
			});
		},
		updateWinnerOrTopScorer(state, action) {
			// Get the type from the components(curWinnerTeamChoice, curTopScorerChoice).
			const { type, data } = action.payload;
			state[type] = data;
		},
	},
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;
