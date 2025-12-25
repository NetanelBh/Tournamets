import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	matches: []
};

const matchesSlice = createSlice({
	initialState,
	name: "matches",
	reducers: {
		load(state, action) {
			state.matches = action.payload;
		},
		// When get the update from mongo, update the final result of the match
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
		addMatch(state, action) {		
			state.matches.push(action.payload);
		}
	},
});

export const matchesActions = matchesSlice.actions;
export default matchesSlice.reducer;
