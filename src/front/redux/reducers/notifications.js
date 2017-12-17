import { Map } from 'immutable';
import {
  APPEND_NOTIFICATION,
  REMOVE_NOTIFICATION,
  REMOVE_NOTIFICATIONS,
} from '../actions';
import { Notification } from '../../records';

const initialState = new Map();

const reducers = {
  [APPEND_NOTIFICATION](
    state,
    { id, type = 'info', message, removable = true, ephemeral = true },
  ) {
    return state.set(
      id,
      new Notification({
        id,
        type,
        message,
        removable,
        ephemeral,
      }),
    );
  },

  [REMOVE_NOTIFICATION](state, id) {
    return state.delete(id);
  },

  [REMOVE_NOTIFICATIONS](state, idList) {
    return state.deleteAll(idList);
  },
};

export default function notifications(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return reducer ? reducer(state, payload) : state;
}
