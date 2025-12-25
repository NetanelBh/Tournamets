import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    now: new Date().toISOString(),
};

const clockSlice = createSlice({
    initialState,
    name: "clock",
    reducers: {
        tick(state) {
            state.now = new Date().toISOString();
        },
    },
});

export const { tick } = clockSlice.actions;
export default clockSlice.reducer;