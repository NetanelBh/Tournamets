import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    players: [],
};

const playersSlice = createSlice({
    initialState,
    name: "players",
    reducers: {
        load(state, action) {    
            state.players = action.payload;
        },
    },
});

export const playersActions = playersSlice.actions;
export default playersSlice.reducer;