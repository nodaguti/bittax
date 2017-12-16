import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { Map } from 'immutable';
import { TradeStat } from '../records';
import {
  tradeActions,
  strategies,
} from '../constants';

export const getCoins = createSelector(
  (state) => state.transactions.coins,
  (coins) => coins.keySeq(),
);

export const getProviders = createSelector(
  (state) => state.transactions.fetchedAt,
  (fetchedAtList) => fetchedAtList.keySeq(),
);

export const getFetchedAt = (state, props) =>
  state.transactions.fetchedAt.get(props.provider);

export const getTransactionsByCoin = (state, props) =>
  state.transactions.coins.get(props.coin);

export const getTransactionsByProvider = createCachedSelector(
  (state) => state.transactions.coins,
  (_, props) => props.provider,
  (transactionsGroupedByCoin, provider) => (
    transactionsGroupedByCoin.map((transactions) =>
      transactions.filter((transaction) => transaction.provider === provider))
  ),
)((_, provider) => provider);

export const getLastTransactionsByProvider = createCachedSelector(
  getTransactionsByProvider,
  (_, props) => props.provider,
  (filteredTransactionsGroupedByCoin) =>
    filteredTransactionsGroupedByCoin.map((transactions) => transactions.last()),
)((_, provider) => provider);

const transactionReducers = {
  [strategies.MOVING_AVERAGE]: {
    [tradeActions.ASK](prevStat, transaction, reportCurrency) {
      const { averageCost } = prevStat;
      const totalAmount = prevStat.totalAmount - transaction.amount;
      const totalCost = averageCost * totalAmount;
      const totalCommission =
        prevStat.totalCommission + transaction.commission[reportCurrency];
      const totalGain =
        prevStat.totalGain +
        (transaction.amount * (transaction.price[reportCurrency] - averageCost));

      return new TradeStat({
        totalAmount,
        averageCost,
        totalCost,
        totalCommission,
        totalGain,
      });
    },

    [tradeActions.BID](prevStat, transaction, reportCurrency) {
      const { totalGain } = prevStat;
      const totalAmount = prevStat.totalAmount + transaction.amount;
      const totalCost =
        prevStat.totalCost +
        (transaction.price[reportCurrency] * transaction.amount);
      const averageCost = totalCost / totalAmount;
      const totalCommission =
        prevStat.totalCommission + transaction.commission[reportCurrency];

      return new TradeStat({
        totalAmount,
        averageCost,
        totalCost,
        totalCommission,
        totalGain,
      });
    },

    [tradeActions.DEPOSIT](prevStat, transaction, reportCurrency) {
      const {
        averageCost,
        totalGain,
      } = prevStat;
      const totalAmount = prevStat.totalAmount + transaction.amount;
      const totalCost = totalAmount * averageCost;
      const totalCommission =
        prevStat.totalCommission + transaction.commission[reportCurrency];

      return new TradeStat({
        totalAmount,
        averageCost,
        totalCost,
        totalCommission,
        totalGain,
      });
    },

    [tradeActions.WITHDRAW](prevStat, transaction, reportCurrency) {
      const {
        averageCost,
        totalGain,
      } = prevStat;
      const totalAmount = prevStat.totalAmount - transaction.amount;
      const totalCost = totalAmount * averageCost;
      const totalCommission =
        prevStat.totalCommission + transaction.commission[reportCurrency];

      return new TradeStat({
        totalAmount,
        averageCost,
        totalCost,
        totalCommission,
        totalGain,
      });
    },
  },
};

export const makeReportWithStrategy = ({ strategy, transactions, reportCurrency }) => (
  (Map()).withMutations((mutableMap) => {
    transactions.reduce((prevStat, transaction, key) => {
      const { action } = transaction;
      const stat = transactionReducers[strategy][action](
        prevStat,
        transaction,
        reportCurrency,
      );

      mutableMap.set(key, stat);
      return stat;
    }, new TradeStat());
  })
);

export const getReportStrategy = (state) => state.report.strategy;

export const getReportCurrency = (state) => state.report.reportCurrency;

export const getCoinReport = createCachedSelector(
  getTransactionsByCoin,
  getReportStrategy,
  getReportCurrency,
  (_, props) => props.coin,
  (transactions, strategy, reportCurrency) =>
    makeReportWithStrategy({
      transactions,
      strategy,
      reportCurrency,
    }),
)((_, strategy, reportCurrency, coin) => `${coin}-${strategy}-${reportCurrency}`);

export const getProviderReport = createSelector(
  getTransactionsByProvider,
  getReportStrategy,
  getReportCurrency,
  (_, props) => props.provider,
  (filteredTransactionsGroupedByCoin, strategy, reportCurrency) =>
    filteredTransactionsGroupedByCoin.map((transactions) =>
      makeReportWithStrategy({
        transactions,
        strategy,
        reportCurrency,
      })),
);

export const getLastCoinTradeStat = createCachedSelector(
  getCoinReport,
  (state, props) => state.transactions.coins.get(props.coin),
  (_, props) => props.coin,
  (tradeStats, transactions) => {
    const lastKey = transactions.keySeq().last();
    return tradeStats.get(lastKey);
  },
)((_, __, coin) => coin);

export const getTotalReport = createSelector(
  (state) =>
    getCoins(state).map((coin) =>
      getLastCoinTradeStat(state, { coin })),
  (stats) =>
    stats.reduce((totalStat, lastTradeStat) =>
      totalStat.withMutations((mutableStat) =>
        [
          'totalCost',
          'totalCommission',
          'totalGain',
        ].forEach((key) => mutableStat.set(
          key,
          mutableStat.get(key) + lastTradeStat.get(key),
        ), new TradeStat()))),
);
