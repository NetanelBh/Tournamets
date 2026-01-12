import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// The current and db properties are for comparing before sending redundant request to server
	dbTopScorer: null,
	dbWinnerTeam: null,
	// Store the bets of specific user for the specific tournament
	userDbScore: [],
	// store all users bets for the specific tournament
	allUsersBets: {},
	// store the users topScorer bets when the tournament is started
	allUsersTopScorersAndWinnerTeams: [],
};

const betSlice = createSlice({
	initialState,
	name: "bets",
	reducers: {
		load(state, action) {			
			action.payload.forEach((bet) => {				
				if (bet.type === "userDbScore") {
					state.userDbScore = bet.data;
				} else if (bet.type === "dbTopScorer") {
					state.dbTopScorer = bet.data;
				} else if (bet.type === "dbWinnerTeam") {
					state.dbWinnerTeam = bet.data;
				} else if (bet.type === "usersBetsForMatch") {					
					// Clear the redux state in first time before saving(prevent from persist redux use the old data)
					state.allUsersBets = {};
					bet.data.forEach((user) => {												
						if (!state.allUsersBets[user.matchId]) {							
							state.allUsersBets[user.matchId] = [{ userId: user.userId, betScore: user.betScore }];
							return;
						}
						
						// If the matchId exist, check if the bet is not inserted already
						const isExist = state.allUsersBets[user.matchId].some((bet) => bet.userId === user.userId);						
						if (!isExist) {							
							state.allUsersBets[user.matchId].push({ userId: user.userId, betScore: user.betScore });
						}
					});
				}
			});
		},
		updateWinnerOrTopScorer(state, action) {
			const { type, data } = action.payload;
			state[type] = data;
		},
		placeBet(state, action) {
			// Find if the bet already exists by matchId, if found, change only the score. If not exist, it's a new bet
			const matchIndex = state.userDbScore.findIndex((match) => match.matchId === action.payload.matchId);
			if (matchIndex !== -1) {
				state.userDbScore[matchIndex].betScore = action.payload.betScore;
			} else {
				state.userDbScore.push(action.payload);
			}
		},
		clear(state) {
			state.dbTopScorer = null;
			state.dbWinnerTeam = null;
			state.userDbScore = [];
		},
	},
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;
