import { combineReducers, configureStore } from '@reduxjs/toolkit';
import paymentReducer from './PaymentRedux';
import productReducer from './ProductsRedux';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  payment: paymentReducer,
  product: productReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});
