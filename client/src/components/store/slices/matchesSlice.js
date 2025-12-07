import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	matches: [], isStarted: false
};

const matchessSlice = createSlice({
	initialState,
	name: "matches",
	reducers: {
		load(state, action) {
			state.matches = action.payload;
		},
		updateStartTime(state) {
			state.isStarted = true;
		},
		updateFinalResult(state, action) {
			// Find the index of the match(in case we want to update the final score of existing match)
			const index = state.matches.findIndex((match) => match._id === action.payload._id);
			if (index !== -1) {
				state.matches[index] = action.payload;
			} else {
				// In case I add a new match, I want to add it to the matches list(add manually the knockout group)
				state.matches.push(action.payload);
			}
		},
	},
});

export const matchesActions = matchessSlice.actions;
export default matchessSlice.reducer;
