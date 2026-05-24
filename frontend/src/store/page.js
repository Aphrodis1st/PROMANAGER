import { combineReducers, configureStore } from '@reduxjs/toolkit';
import baseAPI from '../utils/config/api.js';
import appReducer from './reducer/app.js';
import './actions/index.js';

const rootReducer = combineReducers({
  [baseAPI.reducerPath]: baseAPI.reducer,
  appReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});
