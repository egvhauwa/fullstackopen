import deepFreeze from 'deep-freeze';
import counterReducer from './reducer';

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0,
  };

  const actionGood = {
    type: 'GOOD',
  };
  const actionOk = {
    type: 'OK',
  };
  const actionBad = {
    type: 'BAD',
  };
  const actionZero = {
    type: 'ZERO',
  };

  test('should return a proper initial state when called with undefined state', () => {
    const state = {};
    const action = {
      type: 'DO_NOTHING',
    };

    const newState = counterReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test('good is incremented', () => {
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, actionGood);
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0,
    });
  });

  test('ok is incremented', () => {
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, actionOk);
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0,
    });
  });

  test('bad is incremented', () => {
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, actionBad);
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1,
    });
  });

  test('reset to zero', () => {
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, actionGood);
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0,
    });
    deepFreeze(newState);
    const zeroState = counterReducer(newState, actionZero);
    expect(zeroState).toEqual({
      good: 0,
      ok: 0,
      bad: 0,
    });
  });
});
