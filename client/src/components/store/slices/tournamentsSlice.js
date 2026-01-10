import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tournaments: [],
};

const tournamentsSlice = createSlice({
    initialState,
    name: "tournaments",
    reducers: {
        load(state, action) {   
            state.tournaments = action.payload;
        },
        addTournament(state, action) {
            state.tournaments.push(action.payload);
        },
        updateTopPlayerOrWinnerTeam(state, action) {
            // Get the type from the components(WinnerTeamChoice, TopScorerChoice).
            const { type, data } = action.payload;
            const relevantTournamet = state.tournaments.find((t) => t._id === data.tournamentId);
            relevantTournamet[type] = data.data;
        },
    },
});

export const tournamentsActions = tournamentsSlice.actions;
export default tournamentsSlice.reducer;