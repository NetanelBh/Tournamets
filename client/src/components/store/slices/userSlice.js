import { createSlice } from "@reduxjs/toolkit";

const initialState = {user: {}, allUsers: []};

const userSlice = createSlice({
	initialState,
	name: "user",
	reducers: {
		load(state, action) {
			const {type, data} = action.payload;
			if (type === "user") {
				state.user = data;
			} else if(type === "allUsers") {				
				state.allUsers = data;
			}			
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
