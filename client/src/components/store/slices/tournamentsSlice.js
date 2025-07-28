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
        }
    },
});

export const tournamentsActions = tournamentsSlice.actions;
export default tournamentsSlice.reducer;