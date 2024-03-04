import { createSlice } from '@reduxjs/toolkit';

import loginService from '../services/login';
import blogService from '../services/blogs';

import { setError } from './notificationReducer';

const loggedUserSlice = createSlice({
  name: 'loggedUser',
  initialState: null,
  reducers: {
    setLoggedUser(state, action) {
      return action.payload;
    },
  },
});

export const { setLoggedUser } = loggedUserSlice.actions;

export const initializeLoggedUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setLoggedUser(user));
      blogService.setToken(user.token);
    }
  };
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login(credentials);
      console.log(loggedUser);
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      dispatch(setLoggedUser(loggedUser));
      blogService.setToken(loggedUser.token);
    } catch (exception) {
      console.log(exception);
      dispatch(setError('wrong credentials'));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedUser');
    dispatch(setLoggedUser(null));
  };
};

export default loggedUserSlice.reducer;
