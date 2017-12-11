import { fork, take, put, takeEvery } from 'redux-saga/effects';
import {
  REQUEST_OAUTH_INTEGRATION,
  OAUTH_TOKEN_FETCHED,
  fetchTradesOfAllPairs,
  appendNotification,
} from '../../actions';

function* callFetchTokenAndTransactions({ payload: { provider } }) {
  // Wait until the expecting token has been fetched
  while (true) {
    const { payload: { provider: _provider } } = yield take(OAUTH_TOKEN_FETCHED);

    if (_provider === provider) {
      break;
    }
  }

  yield put(appendNotification({
    id: `${provider}-integration-completed`,
    message: `${provider} の OAuth 連携が完了しました．取引データの取得完了まで今しばらくお待ちください．`,
  }));

  yield put(fetchTradesOfAllPairs({ provider }));
}

function* integrateViaOAuth() {
  yield takeEvery(REQUEST_OAUTH_INTEGRATION, callFetchTokenAndTransactions);
}

export default function* integrationSaga() {
  yield fork(integrateViaOAuth);
}
