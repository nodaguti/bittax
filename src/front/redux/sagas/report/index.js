import { fork, put, call, take, select, actionChannel } from 'redux-saga/effects';
import { Map } from 'immutable';
import { EventEmitter } from 'events';
import {
  MAKE_REPORT,
  fetchedPricesInReportCurrency,
  completedMakingReport,
  emitError,
} from '../../actions';
import APIs from '../../../api';
import { fetchWithRequestHandling, all } from '../utils';
import {
  getReportCurrency,
  getCoins,
  getProviders,
  getCoinReport,
  getProviderReport,
  getTotalReport,
} from '../../../selectors/transactionSelectors';
import { intl } from '../i18n';
import messages from './messages';

const api = APIs.cryptoCompare.public;

const isPriceFilled = (transaction, reportCurrency) =>
  Number.isFinite(transaction.price[reportCurrency]) &&
  Number.isFinite(transaction.commission[reportCurrency]);

const fetchPrices = (transactionsGroupedByCoin, reportCurrency) => {
  const emitter = new EventEmitter();

  const total =
    transactionsGroupedByCoin.reduce((subtotal, transactions) =>
      subtotal + transactions.size(), 0);
  let done = 0;

  emitter.emit('progress', { total, done });

  const transactionsLackingInPrices =
    transactionsGroupedByCoin.map((transactions) =>
      transactions.filter((transaction) => {
        if (!isPriceFilled(transaction, reportCurrency)) {
          done += 1;
          return false;
        }

        return true;
      }));

  emitter.emit('progress', { total, done });

  // early return when there is no transactions to process
  if (total === done) {
    setTimeout(() => emitter.emit('end', null), 0);
    return emitter;
  }

  const fetch = (...args) =>
    api.fetchPriceAt(...args)
      .then((data) => {
        done += 1;
        emitter.emit('progress', { total, done });
        return data;
      });

  const reqs =
    transactionsLackingInPrices.map((transactions) =>
      all(transactions.map((transaction) =>
        fetch({
          base: transaction.base,
          quoted: reportCurrency,
          provider: transaction.provider,
          timestamp: transaction.timestamp,
        })).toObject())).toObject();

  all(reqs).then((results) => emitter.emit('end', results));

  return emitter;
};

function* getPricesInReportCurrency() {
  const reportCurrency = yield select(getReportCurrency);
  const transactionsGroupedByCoin = yield select((state) => state.transactions.coins);
  const activityId = `fetching-prices-${Date.now()}`;
  const activityTitle = intl().formatMessage(messages.fetchingPrices);

  return yield call(
    fetchWithRequestHandling,
    { id: activityId, title: activityTitle },
    fetchPrices,
    transactionsGroupedByCoin,
    reportCurrency,
  );
}

function* getCoinReports() {
  const coins = yield select(getCoins);
  const selects =
    coins.toArray().map((coin) =>
      select(getCoinReport, { coin }));
  const reports = yield all(selects);

  return (Map()).withMutations((mutableMap) => {
    coins.forEach((coin, idx) =>
      mutableMap.set(coin, reports[idx]));
  });
}

function* getProviderReports() {
  const providers = yield select(getProviders);
  const selects =
    providers.toArray().map((provider) =>
      select(getProviderReport, { provider }));
  const reports = yield all(selects);

  return (Map()).withMutations((mutableMap) => {
    providers.forEach((provider, idx) =>
      mutableMap.set(provider, reports[idx]));
  });
}

function* getTotalReportSaga() {
  return yield select(getTotalReport);
}

function* makeReport() {
  try {
    const prices = yield call(getPricesInReportCurrency);

    if (prices) {
      yield put.resolve(fetchedPricesInReportCurrency(prices));
    }

    // Get the total report first to warm the selector caches up
    const total = yield call(getTotalReportSaga);
    const [coins, providers] = yield all([
      call(getCoinReports),
      call(getProviderReports),
    ]);

    yield put(completedMakingReport(Map({
      total,
      coins,
      providers,
    })));
  } catch (ex) {
    emitError({
      name: intl().formatMessage(messages.makingReportFailed),
      message: intl().formatMessage(messages.makingReportFailedMessage),
      details: ex,
    });
  }
}

function* watchMakeReportActions() {
  const makeReportChannel = yield actionChannel(MAKE_REPORT);

  while (true) {
    yield take(makeReportChannel);
    yield call(makeReport);
  }
}

export default function* reportSaga() {
  yield fork(watchMakeReportActions);
}
