import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// The current and db properties are for comparing before sending redundant request to server
	dbTopScorer: null,
	curTopScorerChoice: null,
	dbWinnerTeam: null,
	curWinnerTeamChoice: null,
	// Store the bets of specific user for the specific tournament
	userDbScore: [],
	usercurrentScore: [],
	// store all users bets for the specific tournament
	allUsersBets: {},
};

const betSlice = createSlice({
	initialState,
	name: "bets",
	reducers: {
		load(state, action) {									
			action.payload.forEach((bet) => {
				// Create copy of the original db bets, make changes only on the copy
				if (bet.type === "userDbScore") {
					state.userDbScore = bet.data;
					state.usercurrentScore = bet.data;
				} else if (bet.type === "dbTopScorer") {
					state.dbTopScorer = bet.data;
					state.curTopScorerChoice = bet.data;
				} else if (bet.type === "dbWinnerTeam") {
					state.dbWinnerTeam = bet.data;
					state.curWinnerTeamChoice = bet.data;
				} else {
					bet.data.forEach((user) => {
						if (!state.allUsersBets[user.matchId]) {
							state.allUsersBets[user.matchId] = [{userId: user.userId, betScore: user.betScore}];	
						} else {
							state.allUsersBets[user.matchId].push({userId: user.userId, betScore: user.betScore});
						}
					});
					
				}
			});
		},
		updateWinnerOrTopScorer(state, action) {
			// Get the type from the components(curWinnerTeamChoice, curTopScorerChoice).
			const { type, data } = action.payload;			
			state[type] = data;
		},
		placeBet(state, action) {
			// Find if the bet already exists by matchId, if so, change only the score. If not exist, is a new bet
			const matchIndex = state.usercurrentScore.findIndex((match) => match.matchId === action.payload.matchId);			
			if (matchIndex !== -1) {
				state.usercurrentScore[matchIndex].betScore = action.payload.betScore;
			} else {
				state.usercurrentScore.push(action.payload);
			}
		},
		// Update the userDbScore only when save matches results bets(to make it equal to DB new data)
		updateUserDbScore(state, action) {
			state.userDbScore = action.payload;
		},
		clear(state) {
			state.dbTopScorer = null;
			state.curTopScorerChoice = null;
			state.dbWinnerTeam = null;
			state.curWinnerTeamChoice = null;
			state.userDbScore = [];
			state.usercurrentScore = [];
		},
		addUsersBet(state, action) {
			usersMatchBets = action.payload;
			// Add to list the new bets of the users(if the match just started and we want to display the users results)
			state.allUsersBets[usersMatchBets.matchId] = usersMatchBets.bets;
		},
	},
});

export const betsActions = betSlice.actions;
export default betSlice.reducer;
