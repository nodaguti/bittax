import actions from '../../constants/actions';

export function emitError({ name, message, stack }) {
  return {
    type: actions.EMIT_ERROR,
    payload: { name, message, stack },
  };
}

export function clearError() {
  return {
    type: actions.CLEAR_ERROR,
  };
}
