import { configureStore } from '@reduxjs/toolkit';
import userData from './slices/userData';

export const store = configureStore({
  reducer: {
    user: userData,
  },
});

export default store;