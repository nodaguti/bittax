import { createAction } from 'redux-actions';

export const REHYDRATION_COMPLETED = 'REHYDRATION_COMPLETED';
export const rehydrationCompleted = createAction(REHYDRATION_COMPLETED);

export const ROUTE_CHANGED = 'ROUTE_CHANGED';
export const routeChanged = createAction(ROUTE_CHANGED);

export const REQUEST_OAUTH_INTEGRATION = 'REQUEST_OAUTH_INTEGRATION';
export const requestOAuthIntegration = createAction(REQUEST_OAUTH_INTEGRATION);

export const OAUTH_POPUP_REDIRECTED = 'OAUTH_POPUP_REDIRECTED';
export const OAUTH_TOKEN_FETCHED = 'OAUTH_TOKEN_FETCHED';
export const REFRESH_OAUTH_TOKEN = 'REFRESH_OAUTH_TOKEN';
export const oAuthPopupRedirected = createAction(OAUTH_POPUP_REDIRECTED);
export const oAuthTokenFetched = createAction(OAUTH_TOKEN_FETCHED);
export const refreshOAuthToken = createAction(REFRESH_OAUTH_TOKEN);

export const TRANSACTIONS_FETCHED = 'TRANSACTIONS_FETCHED';
export const FETCH_TRADES_OF_ALL_PAIRS = 'FETCH_TRADES_OF_ALL_PAIRS';
export const transactionsFetched = createAction(TRANSACTIONS_FETCHED);
export const fetchTradesOfAllPairs = createAction(FETCH_TRADES_OF_ALL_PAIRS);

export const APPEND_NOTIFICATION = 'APPEND_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const REMOVE_NOTIFICATIONS = 'REMOVE_NOTIFICATIONS';
export const appendNotification = createAction(APPEND_NOTIFICATION);
export const removeNotification = createAction(REMOVE_NOTIFICATION);
export const removeNotifications = createAction(REMOVE_NOTIFICATIONS);

export const EMIT_ERROR = 'EMIT_ERROR';
export const EMIT_MASKED_ERROR = 'EMIT_MASKED_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const emitError = createAction(EMIT_ERROR);
export const emitMaskedError = createAction(EMIT_MASKED_ERROR);
export const clearError = createAction(CLEAR_ERROR);
