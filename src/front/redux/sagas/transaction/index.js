import { fork, put, call, takeEvery, all, select } from 'redux-saga/effects';
import camelCase from 'camel-case';
import { Map } from 'immutable';
import {
  FETCH_TRANSACTIONS,
  transactionsFetched,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import { fetchWithRequestHandling } from '../utils';
import { getProviderName } from '../../../providers';
import {
  getFetchedAt,
  getLastTransactionsByProvider,
} from '../../../selectors/transactionSelectors';
import { intl } from '../i18n';
import messages from './messages';

function* callPrivateAPI({ provider, operation }, ...args) {
  const api = APIs[provider];
  const methodName = camelCase(`fetch-${operation}`);
  const providerName = getProviderName(provider);
  const activityId = `${provider}-${operation}-${Date.now()}`;
  const activityTitle = intl().formatMessage(messages[methodName], { provider: providerName });

  return yield call(
    fetchWithRequestHandling,
    { id: activityId, title: activityTitle },
    [api.private, methodName],
    ...args,
  );
}

function* callFetchTransactions({ payload: { provider } }) {
  try {
    const lastFetchedAt = yield select(getFetchedAt, { provider });
    const lastTransactions = yield select(getLastTransactionsByProvider, { provider });
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
        lastTransactions,
      },
    ));
    const results = yield all(calls);
    const mergedResults = (Map()).mergeDeep(...results);

    yield put(transactionsFetched({
      provider,
      transactionsGroupedByCoin: mergedResults,
      fetchedAt: now,
    }));
  } catch (ex) {
    const providerName = getProviderName(provider);

    yield put(emitError({
      name: intl().formatMessage(messages.connectionError),
      message: intl().formatMessage(messages.connectionErrorMessage, { provider: providerName }),
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
