import { createAction } from 'redux-actions';

export const REHYDRATION_COMPLETED = 'REHYDRATION_COMPLETED';
export const rehydrationCompleted = createAction(REHYDRATION_COMPLETED);

export const ROUTE_CHANGED = 'ROUTE_CHANGED';
export const routeChanged = createAction(ROUTE_CHANGED);

export const SET_LOCALE = 'SET_LOCALE';
export const setLocale = createAction(SET_LOCALE);

export const REQUEST_OAUTH_INTEGRATION = 'REQUEST_OAUTH_INTEGRATION';
export const requestOAuthIntegration = createAction(REQUEST_OAUTH_INTEGRATION);

export const OAUTH_POPUP_REDIRECTED = 'OAUTH_POPUP_REDIRECTED';
export const OAUTH_TOKEN_FETCHED = 'OAUTH_TOKEN_FETCHED';
export const REFRESH_OAUTH_TOKEN = 'REFRESH_OAUTH_TOKEN';
export const oAuthPopupRedirected = createAction(OAUTH_POPUP_REDIRECTED);
export const oAuthTokenFetched = createAction(OAUTH_TOKEN_FETCHED);
export const refreshOAuthToken = createAction(REFRESH_OAUTH_TOKEN);

export const FETCH_TRANSACTIONS = 'FETCH_TRANSACTIONS';
export const TRANSACTIONS_FETCHED = 'TRANSACTIONS_FETCHED';
export const FETCHED_PRICES_IN_REPORT_CURRENCY = 'FETCHED_PRICES_IN_REPORT_CURRENCY';
export const fetchTransactions = createAction(FETCH_TRANSACTIONS);
export const transactionsFetched = createAction(TRANSACTIONS_FETCHED);
export const fetchedPricesInReportCurrency = createAction(FETCHED_PRICES_IN_REPORT_CURRENCY);

export const SET_STRATEGY = 'SET_STRATEGY';
export const SET_REPORT_CURRENCY = 'SET_REPORT_CURRENCY';
export const MAKE_REPORT = 'MAKE_REPORT';
export const COMPLETED_MAKING_REPORT = 'COMPLETED_MAKING_REPORT';
export const setStrategy = createAction(SET_STRATEGY);
export const setReportCurrency = createAction(SET_REPORT_CURRENCY);
export const makeReport = createAction(MAKE_REPORT);
export const completedMakingReport = createAction(COMPLETED_MAKING_REPORT);

export const APPEND_NOTIFICATION = 'APPEND_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const REMOVE_NOTIFICATIONS = 'REMOVE_NOTIFICATIONS';
export const appendNotification = createAction(APPEND_NOTIFICATION);
export const removeNotification = createAction(REMOVE_NOTIFICATION);
export const removeNotifications = createAction(REMOVE_NOTIFICATIONS);

export const APPEND_ACTIVITY = 'APPEND_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';
export const appendActivity = createAction(APPEND_ACTIVITY);
export const updateActivity = createAction(UPDATE_ACTIVITY);
export const removeActivity = createAction(REMOVE_ACTIVITY);

export const EMIT_ERROR = 'EMIT_ERROR';
export const EMIT_MASKED_ERROR = 'EMIT_MASKED_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const emitError = createAction(EMIT_ERROR);
export const emitMaskedError = createAction(EMIT_MASKED_ERROR);
export const clearError = createAction(CLEAR_ERROR);
