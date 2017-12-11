import { fork, put, call, takeEvery } from 'redux-saga/effects';
import {
  FETCH_TRADES_OF_ALL_PAIRS,
  transactionsFetched,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import fetchWithRequestHandling from '../utils';
import { intl } from '../i18n';
import messages from './messages';

function* callTradesOfAllPairs({ payload: { provider, since = 0 } }) {
  const api = APIs[provider];
  const activityId = `${provider}-${Date.now()}`;
  const activityTitle = intl().formatMessage(messages.fetchTrades, { provider });

  try {
    const results = yield call(
      fetchWithRequestHandling,
      { id: activityId, title: activityTitle },
      [api.private, 'fetchTradesOfAllPairs'],
      { since },
    );

    yield put(transactionsFetched({ provider, transactionsMap: results }));
  } catch (ex) {
    yield put(emitError({
      name: intl().formatMessage(messages.connectionError),
      message: intl().formatMessage(messages.connectionErrorMessage, { provider }),
      details: ex,
    }));
  }
}

function* tradesOfAllPairs() {
  yield takeEvery(FETCH_TRADES_OF_ALL_PAIRS, callTradesOfAllPairs);
}

export default function* tradeSaga() {
  yield fork(tradesOfAllPairs);
}
