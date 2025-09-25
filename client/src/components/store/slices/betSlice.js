import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // The current and db properties are for comparing before sending redundant request to servet
    dbTopScorer: null, dbWinnerTeam: null, curTopScorerChoice: null, curWinnerTeamChoice: null, dbScore: null, currentScore: []
};

const betSlice = createSlice({
    initialState,
    name: "bets",
    reducers: {
        load(state, action) {
            const {type, data} = action.payload;
			state[type] = data;
        },
        updateChoice(state, action) {
            // Get the type from the components(curWinnerTeamChoice, curTopScorerChoice, currentScore).
            const {type, data} = action.payload;
            state[type] = data;
        }
    }
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;