import { createSlice } from "@reduxjs/toolkit";

// The curWinnerTeam and curTopScoret are for comparing between the DB value to know if need to send update request
const initialState = {dbTopScorer: null, dbWinnerTeam: null, curTopScorerChoice: null, curWinnerTeamChoice: null};

const userSlice = createSlice({
	initialState,
	name: "user",
	reducers: {
		load(state, action) {
			const {type, data} = action.payload;
			state[type] = data;
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
