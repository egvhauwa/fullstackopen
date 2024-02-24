import { createSlice } from '@reduxjs/toolkit';

let timeoutId = null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(_state, action) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      return action.payload;
    },
    removeNotification(state, action) {
      timeoutId = null;
      return null;
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (content) => {
  return async (dispatch) => {
    const notification = { content, error: false };
    dispatch(addNotification(notification));
    timeoutId = setTimeout(() => {
      dispatch(removeNotification(notification));
    }, 5000);
  };
};

export const setError = (content) => {
  return async (dispatch) => {
    const notification = { content, error: true };
    dispatch(addNotification(notification));
    timeoutId = setTimeout(() => {
      dispatch(removeNotification(notification));
    }, 5000);
  };
};

export default notificationSlice.reducer;
