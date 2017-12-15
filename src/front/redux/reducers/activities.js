import { Map } from 'immutable';
import {
  APPEND_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
} from '../actions';
import { Activity } from '../../records';

const initialState = new Map();

const reducers = {
  [APPEND_ACTIVITY](state, {
    id, title, description, total, done,
  }) {
    return state.set(id, new Activity({
      id, title, description, total, done,
    }));
  },

  [UPDATE_ACTIVITY](state, { id, ...propsToUpdate }) {
    return state.withMutations((mutableState) => {
      Object.entries(propsToUpdate)
        .forEach(([k, v]) => mutableState.setIn([id, k], v));
    });
  },

  [REMOVE_ACTIVITY](state, id) {
    return state.delete(id);
  },
};

export default function activities(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
