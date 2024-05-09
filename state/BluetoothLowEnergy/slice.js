import { createAction, createSlice } from '@reduxjs/toolkit';

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
  connectedDevices: [],
  retrievedTemp: undefined,
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
      if (!isDuplicteDevice(state.connectedDevices, action.payload)) {
        state.connectedDevices = [...state.connectedDevices, action.payload];
      }
    },
    // TODO: might have to set the temp to the map of the connected devices
    setRetrievedTemp: (state, action) => {
      state.retrievedTemp = action.payload;
    },
    deleteDevice: (state, action) => {
      const { device } = action.payload;
      console.log('deleting device', device);
      const filterDevice = (d) => d.id !== device?.id;
      state.allDevices = state.allDevices.filter(filterDevice);
      state.connectedDevices = state.connectedDevices.filter(filterDevice);
    }
  },
});

export const { deleteDevice, setDevice, setConnectedDevice, setRetrievedTemp } = bleState.actions;

export default bleState.reducer;
