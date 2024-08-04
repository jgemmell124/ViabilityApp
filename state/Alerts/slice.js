import AlertEnum from '@/constants/AlertEnum';
import { createSlice } from '@reduxjs/toolkit';

// fake state for demo purposes
const initialState = {
  alerts: [
    {
      id: 5,
      message: 'Device has disconnected',
      time: new Date() - 6000,
      type: AlertEnum.INFO,
    },
    {
      id: 4,
      message: 'Device reached critical temperature',
      temp: 33,
      time: new Date() - 50000,
      type: AlertEnum.SEVERE,
    },
    {
      id: 3,
      message: 'Device has reconnected',
      time: new Date() - 1000000,
      type: AlertEnum.INFO,
    },
    {
      id: 2,
      message: 'Device has disconnected',
      time: new Date() - 103030303,
      type: AlertEnum.INFO,
    },
    {
      id: 1,
      message: 'Device reached critical temperature',
      temp: 1,
      time: new Date() - 50000000,
      type: AlertEnum.SEVERE,
    },
  ]
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action) {
      state.alerts = [action.payload, ...state.alerts];
    },
    deleteAlert(state, action) {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
    clearAlerts(state) {
      state.alerts = [];
    }
  }
});

export const { addAlert, deleteAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;

