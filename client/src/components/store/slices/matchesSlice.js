import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    matches: []
};

const matchessSlice = createSlice({
    initialState,
    name: "matches",
    reducers: {
        load(state, action) {    
            state.matches = action.payload;
        },
        updateStartTime(state) {
            state.isStarted = true;
        }
    },
});

export const matchesActions = matchessSlice.actions;
export default matchessSlice.reducer;