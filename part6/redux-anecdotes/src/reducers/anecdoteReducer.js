import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      const newAnecdote = action.payload;
      //mutable action possible because reduxjs toolkit uses the Immer library
      state.push(newAnecdote);
      //no return needed because of the mutable action
    },
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { appendAnecdote, updateAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (anecdote) => {
  const votedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(
      votedAnecdote.id,
      votedAnecdote
    );
    dispatch(updateAnecdote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
