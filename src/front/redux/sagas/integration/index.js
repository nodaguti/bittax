import { fork, take, put, takeEvery } from 'redux-saga/effects';
import {
  REQUEST_OAUTH_INTEGRATION,
  OAUTH_TOKEN_FETCHED,
  fetchTransactions,
  appendNotification,
} from '../../actions';
import { getProviderName } from '../../../providers';
import { intl } from '../i18n';
import messages from './messages';

function* callFetchTokenAndTransactions({ payload: { provider } }) {
  // Wait until the expecting token has been fetched
  while (true) {
    const { payload: { provider: _provider } } = yield take(OAUTH_TOKEN_FETCHED);

    if (_provider === provider) {
      break;
    }
  }

  const providerName = getProviderName(provider);

  yield put(appendNotification({
    id: `${provider}-integration-completed`,
    message: intl().formatMessage(messages.completed, { provider: providerName }),
  }));

  // the initial fetch
  yield put(fetchTransactions({ provider }));
}

function* integrateViaOAuth() {
  yield takeEvery(REQUEST_OAUTH_INTEGRATION, callFetchTokenAndTransactions);
}

export default function* integrationSaga() {
  yield fork(integrateViaOAuth);
}
