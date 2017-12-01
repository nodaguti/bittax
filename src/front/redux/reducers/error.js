import { EMIT_MASKED_ERROR, CLEAR_ERROR } from '../actions';
import { ImmutableError } from '../records';

const initialState = null;

const reducers = {
  [EMIT_MASKED_ERROR]: (state, {
    name, message, stack, details,
  }) => (
    new ImmutableError({
      name, message, stack, details,
    })
  ),

  [CLEAR_ERROR]: () => null,
};

export default function resources(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
