import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    ip: null,
    location: null,
  },
  reducers: {
    setIp: (state, action) => {
      state.ip = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setIp, setLocation } = locationSlice.actions;
export default locationSlice.reducer;
