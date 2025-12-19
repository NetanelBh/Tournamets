import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// defaults to localStorage
import storage from "redux-persist/lib/storage";

import betsReducer from "./slices/betSlice.js";
import userReducer from "./slices/userSlice.js";
import playersReducer from "./slices/playersSlice.js";
import matchesReducer from "./slices/matchesSlice.js";
import loadingReducer from "./slices/loadingSlice.js";
import tournamentsReducer from "./slices/tournamentsSlice.js";

const rootReducer = combineReducers({
	user: userReducer,
	bets: betsReducer,
	players: playersReducer,
	matches: matchesReducer,
	tournaments: tournamentsReducer,
	loading: loadingReducer,
});

const persistConfig = {
	key: "root",
	storage,
	blacklist: ["loading"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
