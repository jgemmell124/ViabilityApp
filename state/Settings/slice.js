import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unit: 'F'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnitF(state) {
      state.unit = 'F';
    },
    setUnitC(state) {
      state.unit = 'C';
    }
  }
});

export const { setUnitF, setUnitC } = settingsSlice.actions;
export default settingsSlice.reducer;
