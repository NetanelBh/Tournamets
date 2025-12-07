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
			state.matches = state.matches.map((match) => match._id === action.payload._id ? action.payload : match);
		},
	},
});

export const matchesActions = matchessSlice.actions;
export default matchessSlice.reducer;
