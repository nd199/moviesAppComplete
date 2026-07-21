import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import paymentReducer from './PaymentRedux';
import productReducer from './ProductsRedux';
import userReducer from './userSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
  blacklist: [], // Tokens are managed by authStore.js, not Redux
};

const rootReducer = combineReducers({
  payment: paymentReducer,
  product: productReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
