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
    },
});

export const tournamentsActions = tournamentsSlice.actions;
export default tournamentsSlice.reducer;