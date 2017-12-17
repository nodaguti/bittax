/* eslint-disable no-continue */
import { delay } from 'redux-saga';
import { fork, take, call, put, select, all } from 'redux-saga/effects';
import {
  REHYDRATION_COMPLETED,
  OAUTH_TOKEN_FETCHED,
  refreshOAuthToken,
} from '../../actions';
import APIs from '../../../api';

function* delayedRun(ms, func, ...args) {
  yield call(delay, ms);
  yield call(func, ...args);
}

function* oAuthTokenFetched() {
  while (true) {
    const { payload: { provider, token } } = yield take(OAUTH_TOKEN_FETCHED);
    APIs[provider].private.setToken(token);
  }
}

function* keepTokenFresh() {
  while (true) {
    const { payload: { provider, refreshToken, expire } } = yield take(
      OAUTH_TOKEN_FETCHED,
    );

    if (expire === 0) {
      continue;
    }

    const now = Date.now();
    const margin = 10 * 1000;

    yield fork(
      delayedRun,
      expire - now - margin,
      put,
      refreshOAuthToken({ provider, refreshToken }),
    );
  }
}

function* rehydrateTokens() {
  while (true) {
    yield take(REHYDRATION_COMPLETED);

    const tokens = yield select((state) => state.oauth);
    const now = Date.now();
    const puts = [];

    tokens.forEach((tokenRecord, provider) => {
      const { token, refreshToken, expire } = tokenRecord;

      if (expire !== 0 && expire <= now) {
        puts.push(put(refreshOAuthToken({ provider, refreshToken })));
      } else {
        APIs[provider].private.setToken(token);
      }
    });

    yield all(puts);
  }
}

export default function* apiSaga() {
  yield fork(oAuthTokenFetched);
  yield fork(keepTokenFresh);
  yield fork(rehydrateTokens);
}
