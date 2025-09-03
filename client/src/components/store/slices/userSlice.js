import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
	initialState,
	name: "user",
	reducers: {
		load(state, action) {
			state.user = action.payload;
		},
		addGroup(state, action) {
			state.user.groups.push(action.payload);
		},
		joinTournament(state, action) {
			state.user.tournaments.push(action.payload);
		},
		joinGroup(state, action) {
			state.user.groups.push(action.payload);
		},
		leaveTournament(state, action) {
			state.user.tournaments = state.user.tournaments.filter((t) => t !== action.payload);
		},
		leaveGroup(state, action) {			
			state.user.groups = state.user.groups.filter((g) => g._id !== action.payload);
		},
	},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
