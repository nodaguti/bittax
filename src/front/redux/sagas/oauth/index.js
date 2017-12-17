/* eslint-disable no-continue */
import { fork, take, put, join, call, takeEvery } from 'redux-saga/effects';
import {
  REQUEST_OAUTH_INTEGRATION,
  OAUTH_POPUP_REDIRECTED,
  REFRESH_OAUTH_TOKEN,
  oAuthTokenFetched,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import { getProviderName } from '../../../providers';
import { intl } from '../i18n';
import messages from './messages';

function waitForCodeReceived({ provider, expectedOrigin, expectedState }) {
  return new Promise((resolve) => {
    const onMessage = ({ data, origin }) => {
      if (origin !== expectedOrigin) return;
      if (!data) return;

      const { provider: _provider, code, state } = data;

      if (_provider !== provider) return;
      if (state !== expectedState) return;

      window.removeEventListener('message', onMessage);
      resolve(code);
    };

    window.addEventListener('message', onMessage, false);
  });
}

function* fetchCode({ provider }) {
  const api = APIs[provider].oAuth;
  const { state, authWin } = api.openAuthWindow();
  const selfOrigin = window.location.origin;

  const code = yield call(waitForCodeReceived, {
    provider,
    expectedOrigin: selfOrigin,
    expectedState: state,
  });

  authWin.postMessage({ provider, ack: 'ack' }, selfOrigin);

  return { state, code };
}

function* fetchToken({ provider, code, state }) {
  const api = APIs[provider].oAuth;
  const { state: stateReturned, token, refreshToken, expire } = yield call(
    api.fetchToken,
    { code },
  );

  if (stateReturned !== state) {
    throw new Error(
      `state mismatched, possibly compromised!: ${state}, ${stateReturned}`,
    );
  }

  return { token, refreshToken, expire };
}

function* callAuthenticate({ payload: { provider } }) {
  try {
    const { state, code } = yield call(fetchCode, { provider });
    const { token, refreshToken, expire } = yield call(fetchToken, {
      provider,
      code,
      state,
    });

    yield put(
      oAuthTokenFetched({
        provider,
        token,
        refreshToken,
        expire,
      }),
    );
  } catch (ex) {
    yield put(
      emitError({
        name: intl().formatMessage(messages.authenticationError),
        message: intl().formatMessage(messages.authenticationErrorMessage),
        details: ex,
      }),
    );
  }
}

function* authenticate() {
  yield takeEvery(REQUEST_OAUTH_INTEGRATION, callAuthenticate);
}

function* callUpdateToken({ payload: { provider, refreshToken } }) {
  const api = APIs[provider].oAuth;

  try {
    const { token, refreshToken: newRefreshToken, expire } = yield call(
      api.refreshToken,
      { refreshToken },
    );

    yield put(
      oAuthTokenFetched({
        provider,
        token,
        refreshToken: newRefreshToken,
        expire,
      }),
    );
  } catch (ex) {
    const providerName = getProviderName(provider);

    yield put(
      emitError({
        name: intl().formatMessage(messages.connectionError),
        message: intl().formatMessage(messages.connectionErrorMessage, {
          provider: providerName,
        }),
        details: ex,
      }),
    );
  }
}

function* updateToken() {
  yield takeEvery(REFRESH_OAUTH_TOKEN, callUpdateToken);
}

function waitForAckReceived({ provider, expectedOrigin }) {
  return new Promise((resolve) => {
    const onMessage = ({ data, origin }) => {
      if (origin !== expectedOrigin) return;
      if (!data) return;

      const { provider: _provider, ack } = data;

      if (_provider !== provider) return;
      if (ack !== 'ack') return;

      window.removeEventListener('message', onMessage);
      resolve();
    };

    window.addEventListener('message', onMessage, false);
  });
}

function* handleRedirectInPopup() {
  while (true) {
    const { payload: { provider, code, state } } = yield take(
      OAUTH_POPUP_REDIRECTED,
    );
    const mainWin = window.opener;

    if (!mainWin) {
      yield put(
        emitError({
          name: intl().formatMessage(messages.authenticationError),
          message: intl().formatMessage(messages.targetWindowClosed),
        }),
      );
      continue;
    }

    const selfOrigin = window.location.origin;

    const ackReceived = yield fork(waitForAckReceived, {
      provider,
      expectedOrigin: selfOrigin,
    });

    mainWin.postMessage({ provider, code, state }, selfOrigin);

    yield join(ackReceived);

    window.close();
    mainWin.focus();
  }
}

export default function* oAuthSaga() {
  yield fork(authenticate);
  yield fork(handleRedirectInPopup);
  yield fork(updateToken);
}
