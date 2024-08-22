import { createAction, createSlice } from '@reduxjs/toolkit';

const RECENT_TEMPS_COUNT = 30;

/* const devices = [ */
/* { id: 0, name: 'My Device', status: 'Active', temp: '48', battery: 99 }, */
/* { id: 1, name: 'Device 1', status: 'Active', temp: '54', battery: 20 }, */
/* { id: 2, name: 'Device 2', status: 'Inactive', temp: '54', battery: 55 }, */
/* { id: 3, name: 'Device 3', status: 'Active', temp: '30', battery: 100 }, */
/* { id: 4, name: 'Device 4', status: 'Inactive', temp: '54', battery: 89 }, */
/* { id: 5, name: 'Device 5', status: 'Active', temp: '54', battery: 10 }, */
/* { id: 6, name: 'Device 6', status: 'Inactive', temp: '54', battery: 1 }, */
/* { id: 7, name: 'Device 7', status: 'Inactive', temp: '54', battery: 0 }, */
/* ] */

// TODO store data on phone
const initialState = {
  allDevices: [],
  connectedDevice: null,
  retrievedTemp: 0,
  lastTemps: [], // last 5 recent temps
  lastContact: 0,
  batteryLevel: 0,
  rssi: 0,
};

const isDuplicteDevice = (devices, nextDevice) => {
  return devices.findIndex((device) => nextDevice.id === device.id) > -1;
};

export const startScanning = createAction('bleState/startScanning');
export const stopScanning = createAction('bleState/stopScanning');
export const startListening = createAction('bleState/startListening');

const bleState = createSlice({
  name: 'bleState',
  initialState,
  reducers: {
    setDevice: (state, action) => {
      if (!isDuplicteDevice(state.allDevices, action.payload)) {
        state.allDevices = [action.payload, ...state.allDevices ];
      }
    },
    setConnectedDevice: (state, action) => {
      state.connectedDevice = action.payload;
    },
    setRetrievedTemp: (state, action) => {
      const now = Date.now();
      const temp = action.payload;
      const newTemp = {
        temp,
        time: now,
      };
      state.retrievedTemp = temp;
      state.lastContact = now;
      state.lastTemps = [newTemp, ...state.lastTemps.slice(0, RECENT_TEMPS_COUNT - 1)];
    },
    setBatteryLevel: (state, action) => {
      state.batteryLevel = action.payload;
    },
    deleteDevice: (state, action) => {
      const deviceId = action.payload;
      const filterDevice = (d) => d.id !== deviceId;
      state.allDevices = state.allDevices.filter(filterDevice);
      state.connectedDevice = null;
    },
    setRSSI: (state, action) => {
      state.rssi = action.payload;
    }
  },
});

export const {
  deleteDevice,
  setDevice,
  setConnectedDevice,
  setRetrievedTemp,
  setBatteryLevel,
  setRSSI,
} = bleState.actions;

export default bleState.reducer;
