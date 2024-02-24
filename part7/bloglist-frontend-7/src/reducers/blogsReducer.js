import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

import { initializeUsers } from '../reducers/usersReducer';
import { setNotification, setError } from './notificationReducer';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      //mutable action possible because reduxjs toolkit uses the Immer library
      state.push(action.payload);
      //no return needed because of the mutable action
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    setBlogs(state, action) {
      return action.payload;
    },
    removeBlog(state, action) {
      const blogToDelete = action.payload;
      return state.filter((blog) => blog.id !== blogToDelete.id);
    },
  },
});

export const { appendBlog, updateBlog, setBlogs, removeBlog } =
  blogsSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const addBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog);
      console.log(newBlog);
      dispatch(appendBlog(newBlog));
      dispatch(initializeUsers());
      dispatch(
        setNotification(
          `A new blog ${newBlog.title} by ${newBlog.author} added`
        )
      );
    } catch (exception) {
      console.log(exception);
    }
  };
};

export const likeBlog = (blog) => {
  const likedBlog = {
    ...blog,
    likes: blog.likes + 1,
  };
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(likedBlog.id, likedBlog);
      dispatch(updateBlog(updatedBlog));
      dispatch(setNotification(`Blog ${blog.title} by ${blog.author} liked`));
    } catch (exception) {
      console.log(exception);
      dispatch(setError('failed to like blog'));
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog));
      dispatch(setNotification(`Blog ${blog.title} by ${blog.author} removed`));
    } catch (exception) {
      console.log(exception);
      dispatch(setError('failed to remove blog'));
    }
  };
};

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    try {
      const commentedBlog = await blogService.comment(blog.id, comment);
      dispatch(updateBlog(commentedBlog));
      dispatch(
        setNotification(`Comment added to blog ${blog.title} by ${blog.author}`)
      );
    } catch (exception) {
      console.log(exception);
      dispatch(setError('failed to comment blog'));
    }
  };
};

export default blogsSlice.reducer;
