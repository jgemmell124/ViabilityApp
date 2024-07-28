import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [
    {
      id: 1,
      message: 'Device 1 has disconnected',
    },
    {
      id: 2,
      message: 'Device 2 has disconnected',
    },
    {
      id: 3,
      message: 'Device 3 has disconnected',
    },
    {
      id: 4,
      message: 'Device 4 has disconnected',
    },
    {
      id: 5,
      message: 'Device 5 has disconnected',
    },
    {
      id: 6,
      message: 'Device 6 has disconnected',
    },
    {
      id: 7,
      message: 'Device 7 has disconnected',
    },
  ]
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action) {
      state.alerts.push(action.payload);
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

