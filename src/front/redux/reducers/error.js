import camelCase from 'camel-case';
import { ImmutableError } from '../records';

const ACTIONS_MAP = {
  emitError(state, {
    name, message, stack, details,
  }) {
    return new ImmutableError({
      name, message, stack, details,
    });
  },

  clearError() {
    return null;
  },
};

const initialState = null;

export default function resources(state = initialState, { type, payload }) {
  const reducer = ACTIONS_MAP[camelCase(type)];

  return (reducer) ? reducer(state, payload) : state;
}
