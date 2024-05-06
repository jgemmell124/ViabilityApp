import { createAsyncThunk, createListenerMiddleware } from "@reduxjs/toolkit";
import {
    deleteDevice,
  setConnectedDevice,
  setDevice,
  setRetrievedTemp,
  startListening,
  startScanning,
  stopScanning,
} from "./slice";

import bleManager from "./BLEManager";

const DEVICE_NAME = "VIABILITY_DEVICE";

export const bleMiddleware = createListenerMiddleware();

export const connectToDevice = createAsyncThunk(
  "bleThunk/connectToDevice",
  async (ref, thunkApi) => {
    if (ref.id) {
      await bleManager.connectToPeripheral(ref.id);
      thunkApi.dispatch(setConnectedDevice(ref));
      /* bleManager.stopScanningForPeripherals(); */
    }
  }
);

export const disconnectFromDevice = createAsyncThunk(
  "bleThunk/disconnectFromDevice",
  (ref, thunkApi) => {
    if (ref.id) {
      bleManager.disconnectFromPeripheral(ref.id)
      .finally(() => thunkApi.dispatch(deleteDevice(ref)));
    }
  }
);

export const readTempFromDevice = createAsyncThunk(
  "bleThunk/readColorFromDevice",
  async (_, thunkApi) => {
    const temp = await bleManager.readTemp();
    thunkApi.dispatch(setRetrievedTemp(temp));
  }
);

bleMiddleware.startListening({
  actionCreator: stopScanning,
  effect: () => {
    bleManager.stopScanningForPeripherals();
  },
})

bleMiddleware.startListening({
  actionCreator: startScanning,
  effect: (_, listenerApi) => {
    bleManager.scanForPeripherals(async (device) => {
      if (device.name === DEVICE_NAME) {
        listenerApi.dispatch(setDevice(device));
        /* await bleManager.connectToPeripheral(ref.id); */
        /* listenerApi.dispatch(setConnectedDevice(device)) */
      }
    });
  },
});

bleMiddleware.startListening({
  actionCreator: startListening,
  effect: (_, listenerApi) => {
    bleManager.startStreamingData(({ payload }) => {
      console.log('payload', payload);
      listenerApi.dispatch(setRetrievedTemp(payload));
    });
  },
});
