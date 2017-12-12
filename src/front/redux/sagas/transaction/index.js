import { fork, put, call, takeEvery, all, select } from 'redux-saga/effects';
import camelCase from 'camel-case';
import {
  FETCH_TRANSACTIONS,
  transactionsFetched,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import fetchWithRequestHandling from '../utils';
import { intl } from '../i18n';
import messages from './messages';

function* callPrivateAPI({ provider, operation, ...args }) {
  const api = APIs[provider];
  const methodName = camelCase(`fetch-${operation}`);
  const activityId = `${provider}-${operation}-${Date.now()}`;
  const activityTitle = intl().formatMessage(messages[methodName], { provider });

  return yield call(
    fetchWithRequestHandling,
    { id: activityId, title: activityTitle },
    [api.private, methodName],
    ...args,
  );
}

function* callFetchTransactions({ payload: { provider } }) {
  try {
    const transactionStore = yield select((state) => state.transaction);
    const transactionRecord = transactionStore.get(provider);
    const { fetchedAt: lastFetchedAt = 0 } = transactionRecord || {};
    const now = Date.now();

    const calls = [
      'trades',
      'withdrawals',
      'deposits',
    ].map((operation) => callPrivateAPI({
      provider,
      operation,
      since: lastFetchedAt + 1,
      end: now,
    }));

    const results = yield all(calls);
    const puts = results.map((transactionsMap) => put(transactionsFetched({
      provider,
      transactionsMap,
    })));

    yield all(puts);
  } catch (ex) {
    yield put(emitError({
      name: intl().formatMessage(messages.connectionError),
      message: intl().formatMessage(messages.connectionErrorMessage, { provider }),
      details: ex,
    }));
  }
}

function* fetchTransactions() {
  yield takeEvery(FETCH_TRANSACTIONS, callFetchTransactions);
}

export default function* transactionSaga() {
  yield fork(fetchTransactions);
}
