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

const isPopupBlocked = (win) => new Promise((resolve) => {
  // The detection should be delayed 10 msec to make sure
  // it works properly in Chrome.
  setTimeout(() => {
    try {
      resolve(!(win && win.innerHeight && win.innerHeight > 0));
    } catch (ex) {
      // If an error occurs, it means an window with a different origin is opened.
      resolve(true);
    }
  }, 10);
});

function waitForCodeReceived({ provider, expectedOrigin }) {
  return new Promise((resolve) => {
    const onMessage = ({ data, origin }) => {
      if (origin !== expectedOrigin) return;

      try {
        const { provider: _provider, code, state } = data;

        if (_provider !== provider) return;

        window.removeEventListener('message', onMessage);

        resolve({ code, state });
      } catch (ex) {
        console.error(ex);
      }
    };

    window.addEventListener('message', onMessage, false);
  });
}

function* fetchCode({ provider }) {
  const api = APIs[provider].oAuth;
  const { state, authWin } = api.openAuthWindow();

  // const isBlocked = yield call(isPopupBlocked, authWin);
  // if (isBlocked) {
  //   throw new Error('Popup Blocked');
  // }

  const selfOrigin = window.location.origin;

  const { code, state: stateReturned } = yield call(waitForCodeReceived, {
    provider,
    expectedOrigin: selfOrigin,
  });

  if (stateReturned !== state) {
    throw new Error(`state mismatched, possibly compromised!: ${state}, ${stateReturned}`);
  }

  authWin.postMessage({ provider, ack: 'ack' }, selfOrigin);

  return { state, code };
}

function* fetchToken({ provider, code, state }) {
  const api = APIs[provider].oAuth;
  const {
    state: stateReturned,
    token,
    refreshToken,
    expire,
  } = yield call(api.fetchToken, { code });

  if (stateReturned !== state) {
    throw new Error(`state mismatched, possibly compromised!: ${state}, ${stateReturned}`);
  }

  return { token, refreshToken, expire };
}

function* callAuthenticate({ payload: { provider } }) {
  try {
    const { state, code } = yield call(fetchCode, { provider });
    const {
      token,
      refreshToken,
      expire,
    } = yield call(fetchToken, { provider, code, state });

    yield put(oAuthTokenFetched({
      provider,
      token,
      refreshToken,
      expire,
    }));
  } catch (ex) {
    yield put(emitError({
      name: '認証エラー',
      message: '認証作業中にエラーが発生しました．もう一度やり直してください．',
      details: ex,
    }));
  }
}

function* authenticate() {
  yield takeEvery(REQUEST_OAUTH_INTEGRATION, callAuthenticate);
}

function* callUpdateToken({ payload: { provider, refreshToken } }) {
  const api = APIs[provider].oAuth;

  try {
    const {
      token,
      refreshToken: newRefreshToken,
      expire,
    } = yield call(api.refreshToken, { refreshToken });

    yield put(oAuthTokenFetched({
      provider,
      token,
      refreshToken: newRefreshToken,
      expire,
    }));
  } catch (ex) {
    yield put(emitError({
      name: '通信エラー',
      message: `${provider} の連携が切断されました．もう一度連携し直してください．`,
      details: ex,
    }));
  }
}

function* updateToken() {
  yield takeEvery(REFRESH_OAUTH_TOKEN, callUpdateToken);
}

function waitForAckReceived({ provider, expectedOrigin }) {
  return new Promise((resolve) => {
    const onMessage = ({ data, origin }) => {
      if (origin !== expectedOrigin) return;

      try {
        const { provider: _provider, ack } = data;

        if (_provider !== provider) return;
        if (ack === 'ack') {
          window.removeEventListener('message', onMessage);
          resolve();
        }
      } catch (ex) {
        console.error(ex);
      }
    };

    window.addEventListener('message', onMessage, false);
  });
}

function* handleRedirectInPopup() {
  while (true) {
    const { payload: { provider, code, state } } = yield take(OAUTH_POPUP_REDIRECTED);
    const mainWin = window.opener;

    if (!mainWin) {
      yield put(emitError({
        name: '認証エラー',
        message: '認証情報の保存に失敗しました．操作していたウィンドウが閉じられているようです．',
      }));
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
