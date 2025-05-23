import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice.js';
import boardReducer from './slices/boardSlice.js';
import canvasReducer from './slices/canvasSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    canvas: canvasReducer,
  },
});
