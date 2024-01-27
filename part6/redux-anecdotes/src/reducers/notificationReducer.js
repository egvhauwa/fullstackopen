import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification(_state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      if (state === action.payload) {
        return '';
      }
      return state;
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (content) => {
  return async (dispatch) => {
    dispatch(addNotification(content));
    setTimeout(() => {
      dispatch(removeNotification(content));
    }, 5000);
  };
};

export default notificationSlice.reducer;
