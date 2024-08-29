import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    location: locationReducer,
    theme: themeReducer,
  },
});
