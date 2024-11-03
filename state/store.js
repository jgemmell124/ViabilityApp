import { combineReducers, configureStore } from '@reduxjs/toolkit';

import bleReducer from './BluetoothLowEnergy/slice';
import settingsReducer from './Settings/slice';
import alertsReducer from './Alerts/slice';

const appReducer = combineReducers({
  ble: bleReducer,
  settings: settingsReducer,
  alerts: alertsReducer,
});

export const store = configureStore({
  reducer: appReducer,
});

export const selectDevices = (state) => state.ble.allDevices;
export const selectConnectedDevice = (state) => state.ble.connectedDevice;

export const selectDeviceType = (state) => state.settings.deviceType;
export const selectUnit = (state) => state.settings.unit;

export const selectMinTemp = (state) => state.settings.minTempC;
export const selectMaxTemp = (state) => state.settings.maxTempC;

export const selectLastContact = (state) => state.ble.lastContact;

export const selectDeviceById = (id) => (state) => {
  return state.ble.allDevices.find((device) => device.id === id);
};
