import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
	initialState,
	name: "user",
	reducers: {
		load(state, action) {
			state.user = action.payload;
		},
		addGroup(state, action) {},
		joinTournament(state, action) {			
			state.user.tournaments.push(action.payload);
		},
	},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
