import { fork, put, call, takeEvery, all, select } from 'redux-saga/effects';
import camelCase from 'camel-case';
import { Map } from 'immutable';
import {
  FETCH_TRANSACTIONS,
  transactionsFetched,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import fetchWithRequestHandling from '../utils';
import { intl } from '../i18n';
import messages from './messages';

function* callPrivateAPI({ provider, operation }, ...args) {
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
    const {
      fetchedAt: lastFetchedAt = 0,
      transactions: fetchedTransactions,
    } = transactionRecord || {};
    const operations = [
      'trades',
      'withdrawals',
      'deposits',
    ];
    const now = Date.now();

    const calls = operations.map((operation) => callPrivateAPI(
      {
        provider,
        operation,
      },
      null,
      {
        lastFetchedAt,
        fetchedTransactions,
      },
    ));
    const results = yield all(calls);
    const mergedTransactionsMap = (new Map()).mergeDeep(...results);

    yield put(transactionsFetched({
      provider,
      transactionsMap: mergedTransactionsMap,
      lastFetchedAt: now,
    }));
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
