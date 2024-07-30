import { createSlice } from '@reduxjs/toolkit';

const deviceTypeEnum = {
  InsulinPen: 'Insulin Pen',
  InsulinVial: 'Insulin Vial',
  InsulinCartridge: 'Insulin Cartridge',
};

const initialState = {
  unit: 'F',
  minTempC: 0,
  maxTempC: 100,
  deviceType: deviceTypeEnum.InsulinPen,
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
    },
    setMinTempC(state, action) {
      state.minTempC = action.payload;
    },
    setMaxTempC(state, action) {
      state.maxTempC = action.payload;
    },
    setDeviceType(state, action) {
      if (Object.values(deviceTypeEnum).includes(action.payload)) {
        state.deviceType = action.payload;
      }
    }
  }
});

export const { setUnitF, setUnitC, setDeviceType } = settingsSlice.actions;
export default settingsSlice.reducer;
