import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./ProductsRedux";
import paymentReducer from "./PaymentRedux";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE,
     REGISTER, REHYDRATE,} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};
const root = combineReducers({user: userReducer, product: productReducer, payment: paymentReducer});

const persistedReducer = persistReducer(persistConfig, root);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
