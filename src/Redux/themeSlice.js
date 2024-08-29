// src/slices/themeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultPalette from '../../assets/Palettes/defaultPalette';
import secondPalette from '../../assets/Palettes/secondPalette';
import thirdPalette from '../../assets/Palettes/thirdPalette';
import fourthPalette from '../../assets/Palettes/fourthPalette';
import fifthPalette from '../../assets/Palettes/fifthPalette';
import sixthPalette from '../../assets/Palettes/sixthPalette';
import seventhPalette from '../../assets/Palettes/seventhPalette';

const themePalettes = {
  default: defaultPalette,
  second: secondPalette,
  third: thirdPalette,
  fourth: fourthPalette,
  fifth: fifthPalette,
  sixth: sixthPalette,
  seventh: seventhPalette,
};

const initialState = {
  selectedTheme: themePalettes.default,
  status: 'idle',
};

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const theme = await AsyncStorage.getItem('selectedTheme');
  return theme ? themePalettes[theme] : themePalettes.default;
});

export const saveTheme = createAsyncThunk('theme/saveTheme', async (theme) => {
  await AsyncStorage.setItem('selectedTheme', theme);
  return themePalettes[theme] || themePalettes.default;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.selectedTheme = themePalettes[action.payload] || themePalettes.default;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.selectedTheme = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadTheme.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.selectedTheme = action.payload;
      });
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
