import {configureStore} from '@reduxjs/toolkit';

import tournamentReducer from "./slices/tournamentSlice.js";

const store = configureStore({
    reducer: {
        tournaments: tournamentReducer
    }
});

export default store;