import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
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

