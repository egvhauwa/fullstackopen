import { configureStore } from '@reduxjs/toolkit';

import loggedUserReducer from './reducers/loggedUserReducer';
import usersReducer from './reducers/usersReducer';
import blogsReducer from './reducers/blogsReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    loggedUser: loggedUserReducer,
    users: usersReducer,
    blogs: blogsReducer,
    notification: notificationReducer,
  },
});

export default store;
