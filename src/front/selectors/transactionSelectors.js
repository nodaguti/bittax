import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { Map } from 'immutable';
import { TradeStat } from '../records';
import { tradeActions, strategies } from '../constants';

export const isTransactionsEmpty = createSelector(
  (state) => state.transactions.coins,
  (coins) => coins.isEmpty(),
);

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
  (transactionsGroupedByCoin, provider) =>
    transactionsGroupedByCoin.map((transactions) =>
      transactions.filter((transaction) => transaction.provider === provider),
    ),
)((_, props) => props.provider);

export const getLastTransactionsByProvider = createCachedSelector(
  getTransactionsByProvider,
  (_, props) => props.provider,
  (filteredTransactionsGroupedByCoin) =>
    filteredTransactionsGroupedByCoin.map((transactions) =>
      transactions.last(),
    ),
)((_, provider) => provider);

// While `Number.toFixed` returns a string representation of a fixed number,
// this method returns a number.
const toFixed = (number, digits) => Number(number.toFixed(digits));

const transactionReducers = {
  [strategies.MOVING_AVERAGE]: {
    [tradeActions.ASK](prevStat, transaction, reportCurrency) {
      const { averageCost } = prevStat;
      const totalAmount = prevStat.totalAmount - transaction.amount;
      const totalCost = averageCost * totalAmount;
      const totalCommission =
        prevStat.totalCommission + transaction.commission.get(reportCurrency);
      const totalGain =
        prevStat.totalGain +
        transaction.amount *
          (transaction.price.get(reportCurrency) - averageCost);

      // TODO: digits should be configurable
      return new TradeStat({
        totalAmount: toFixed(totalAmount, 5),
        averageCost: toFixed(averageCost, 5),
        totalCost: toFixed(totalCost, 5),
        totalCommission: toFixed(totalCommission, 5),
        totalGain: toFixed(totalGain, 5),
      });
    },

    [tradeActions.BID](prevStat, transaction, reportCurrency) {
      const { totalGain } = prevStat;
      const totalAmount = prevStat.totalAmount + transaction.amount;
      const totalCost =
        prevStat.totalCost +
        transaction.price.get(reportCurrency) * transaction.amount;
      const averageCost = totalCost / totalAmount;
      const totalCommission =
        prevStat.totalCommission + transaction.commission.get(reportCurrency);

      return new TradeStat({
        totalAmount: toFixed(totalAmount, 5),
        averageCost: toFixed(averageCost, 5),
        totalCost: toFixed(totalCost, 5),
        totalCommission: toFixed(totalCommission, 5),
        totalGain: toFixed(totalGain, 5),
      });
    },

    [tradeActions.DEPOSIT](prevStat, transaction, reportCurrency) {
      const depositAsTransfer = () => {
        const { averageCost, totalGain, totalAmount, totalCost } = prevStat;
        const totalCommission =
          prevStat.totalCommission + transaction.commission.get(reportCurrency);

        return new TradeStat({
          totalAmount: toFixed(totalAmount, 5),
          averageCost: toFixed(averageCost, 5),
          totalCost: toFixed(totalCost, 5),
          totalCommission: toFixed(totalCommission, 5),
          totalGain: toFixed(totalGain, 5),
        });
      };

      const depositAsGift = () =>
        this[tradeActions.BID](prevStat, transaction, reportCurrency);

      return transaction.isTransfer ? depositAsTransfer() : depositAsGift();
    },

    [tradeActions.WITHDRAW](prevStat, transaction, reportCurrency) {
      const withdrawAsTransfer = () => {
        const { averageCost, totalGain, totalAmount, totalCost } = prevStat;
        const totalCommission =
          prevStat.totalCommission + transaction.commission.get(reportCurrency);

        return new TradeStat({
          totalAmount: toFixed(totalAmount, 5),
          averageCost: toFixed(averageCost, 5),
          totalCost: toFixed(totalCost, 5),
          totalCommission: toFixed(totalCommission, 5),
          totalGain: toFixed(totalGain, 5),
        });
      };

      const withdrawAsPurchase = () =>
        this[tradeActions.ASK](prevStat, transaction, reportCurrency);

      return transaction.isTransfer
        ? withdrawAsTransfer()
        : withdrawAsPurchase();
    },
  },
};

export const makeReportWithStrategy = ({
  strategy,
  transactions,
  reportCurrency,
}) =>
  Map().withMutations((mutableMap) => {
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
  });

export const getReportStrategy = (state) => state.report.strategy;

export const getReportCurrency = (state) => state.report.reportCurrency;

export const getCoinReport = createCachedSelector(
  getTransactionsByCoin,
  getReportStrategy,
  getReportCurrency,
  (transactions, strategy, reportCurrency) =>
    makeReportWithStrategy({
      transactions,
      strategy,
      reportCurrency,
    }),
)((_, props) => props.coin);

export const getProviderReport = createCachedSelector(
  getTransactionsByProvider,
  getReportStrategy,
  getReportCurrency,
  (filteredTransactionsGroupedByCoin, strategy, reportCurrency) =>
    filteredTransactionsGroupedByCoin.map((transactions) =>
      makeReportWithStrategy({
        transactions,
        strategy,
        reportCurrency,
      }),
    ),
)((_, props) => props.provider);

export const getLastCoinTradeStat = createCachedSelector(
  getCoinReport,
  (state, props) => state.transactions.coins.get(props.coin),
  (tradeStats, transactions) => {
    const lastKey = transactions.keySeq().last();
    return tradeStats.get(lastKey);
  },
)((_, props) => props.coin);

export const getTotalReport = createSelector(
  (state) =>
    getCoins(state).map((coin) => getLastCoinTradeStat(state, { coin })),
  (stats) =>
    stats.reduce((totalStat, lastTradeStat) =>
      totalStat.withMutations((mutableStat) =>
        ['totalCost', 'totalCommission', 'totalGain'].forEach(
          (key) =>
            mutableStat.set(key, mutableStat.get(key) + lastTradeStat.get(key)),
          new TradeStat(),
        ),
      ),
    ),
);
