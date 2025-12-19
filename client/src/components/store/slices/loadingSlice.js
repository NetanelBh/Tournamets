import { createSlice } from "@reduxjs/toolkit";

const initialState = { count: 0 };

const loadingSlice = createSlice({
	initialState,
	name: "loading",
	reducers: {
		start(state) {
			state.count += 1;
		},
		stop(state) {
			// Prevents the count from going below 0 and will stay forever at -
			state.count = Math.max(0, state.count - 1);
		},
		reset(state) {
			state.count = 0;
		},
	},
});

export const selectIsLoading = (state) => state.loading.count > 0;
export const loadingActions = loadingSlice.actions;
export default loadingSlice.reducer;
