import { createAction } from 'redux-actions';
import * as actions from './constants';

export * from './constants';

export const emitError = createAction(actions.EMIT_ERROR);
export const emitMaskedError = createAction(actions.EMIT_MASKED_ERROR);
export const clearError = createAction(actions.CLEAR_ERROR);
