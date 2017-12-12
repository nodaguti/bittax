import { EMIT_MASKED_ERROR, CLEAR_ERROR } from '../actions';
import { ImmutableError } from '../records';

const initialState = null;

const reducers = {
  [EMIT_MASKED_ERROR](state, {
    name, message, details,
  }) {
    if (process.env.NODE_ENV === 'development') {
      console.error(details);
    }

    return new ImmutableError({
      name,
      message,
      details: {
        name: details.name,
        message: details.message,
        stack: details.stack,
      },
    });
  },

  [CLEAR_ERROR]() {
    return null;
  },
};

export default function error(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
