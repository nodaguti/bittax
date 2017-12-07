import { fork, take, put } from 'redux-saga/effects';
import {
  REQUEST_OAUTH_INTEGRATION,
  OAUTH_TOKEN_FETCHED,
  fetchTradesOfAllPairs,
} from '../actions';

function* integrateViaOAuth() {
  while (true) {
    const { payload: { provider } } = yield take(REQUEST_OAUTH_INTEGRATION);

    while (true) {
      const { payload: { provider: _provider } } = yield take(OAUTH_TOKEN_FETCHED);

      if (_provider === provider) {
        break;
      }
    }

    yield put(fetchTradesOfAllPairs({ provider }));
  }
}

export default function* integrationSaga() {
  yield fork(integrateViaOAuth);
}
