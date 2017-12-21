import test from 'ava';
import { Map, OrderedMap } from 'immutable';
import * as target from '../../../src/front/selectors/transactionSelectors';
import { Transaction, TradeStat, Report } from '../../../src/front/records';
import { tradeActions, reportCurrencies } from '../../../src/front/constants';
import state from '../fixtures/store/transactions';

const toFixed = (number, digits) => Number(number.toFixed(digits));

test('getFetchedAt', (t) => {
  const aaaFetchedAt = target.getFetchedAt(state, { provider: 'aaa' });
  t.is(aaaFetchedAt, 1513999999999);
});

test('getProviders', (t) => {
  const providers = target.getProviders(state);
  t.deepEqual(providers.toJS(), ['aaa', 'bbb']);
});

test('getTransactionsByCoin', (t) => {
  const transactions = target.getTransactionsByCoin(state, {
    coin: tradeActions.BID,
  });
  t.is(transactions.size, 3);
  t.is(transactions.keySeq().toArray()[0], 'bid-0');
});

test('getTransactionsByProvider', (t) => {
  const transactions = target.getTransactionsByProvider(state, {
    provider: 'aaa',
  });
  t.is(transactions.get(tradeActions.BID).size, 2);
  t.is(transactions.get(tradeActions.ASK).size, 2);
  t.is(transactions.get(tradeActions.DEPOSIT).size, 1);
  t.is(transactions.get(tradeActions.WITHDRAW).size, 2);
});

test('getReportStrategy', (t) => {
  const strategy = target.getReportStrategy(state);
  t.is(strategy, new Report().get('strategy'));
});

test('getReportCurrency', (t) => {
  const currency = target.getReportCurrency(state);
  t.is(currency, new Report().get('reportCurrency'));
});

test('getCoinReport: bid', (t) => {
  const report = target.getCoinReport(state, { coin: tradeActions.BID });
  const reportExpected = Map({
    'bid-0': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 50,
      totalGain: 0,
    }),
    'bid-1': new TradeStat({
      averageCost: toFixed(1600 / 1.5, 5),
      totalAmount: 1.5,
      totalCost: 1600,
      totalCommission: 110,
      totalGain: 0,
    }),
    'bid-2': new TradeStat({
      averageCost: toFixed(2240 / 2.3, 5),
      totalAmount: 2.3,
      totalCost: 2240,
      totalCommission: 150,
      totalGain: 0,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});

test('getCoinReport: ask', (t) => {
  const report = target.getCoinReport(state, { coin: tradeActions.ASK });
  const reportExpected = Map({
    'ask-0': new TradeStat({
      averageCost: 0,
      totalAmount: -1.0,
      totalCost: 0,
      totalCommission: 50,
      totalGain: 1000,
    }),
    'ask-1': new TradeStat({
      averageCost: 0,
      totalAmount: -1.5,
      totalCost: 0,
      totalCommission: 110,
      totalGain: 1600,
    }),
    'ask-2': new TradeStat({
      averageCost: 0,
      totalAmount: -2.3,
      totalCost: 0,
      totalCommission: 150,
      totalGain: 2240,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});

test('getCoinReport: deposit', (t) => {
  const report = target.getCoinReport(state, { coin: tradeActions.DEPOSIT });
  const reportExpected = Map({
    'deposit-0': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 50,
      totalGain: 0,
    }),
    'deposit-1': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 110,
      totalGain: 0,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});

test('getCoinReport: withdraw', (t) => {
  const report = target.getCoinReport(state, { coin: tradeActions.WITHDRAW });
  const reportExpected = Map({
    'withdraw-prepare': new TradeStat({
      averageCost: 500,
      totalAmount: 2.0,
      totalCost: 1000,
      totalCommission: 25,
      totalGain: 0,
    }),
    'withdraw-0': new TradeStat({
      averageCost: 500,
      totalAmount: 1.0,
      totalCost: 500,
      totalCommission: 75,
      totalGain: 500,
    }),
    'withdraw-1': new TradeStat({
      averageCost: 500,
      totalAmount: 1.0,
      totalCost: 500,
      totalCommission: 135,
      totalGain: 500,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});

test('getCoinReport: mixed', (t) => {
  /**
   * Mixed transactions including negative gain, coin transfer,
   * coin gift, purchase, and withdrawal to a cold storage.
   *
   * Transaction Details:
   *
   * | Exchange | Action | Amount | Price || Ave. Cost | Total Amount | Total Cost | Total Gain |      Note         |
   * |----------|--------|--------|-------||-----------|--------------|------------|------------|-------------------|
   * |    A     |   bid  |  1.0   | 1000  ||  1000     |     1.0      |   1000     |    0       |                   |
   * |    B     |   bid  |  0.5   |  800  ||   933.333 |     1.5      |   1400     |    0       | float ave. cost   |
   * |    B     |withdraw|  0.3   |  900  ||   933.333 |     1.5      |   1400     |    0       | transfer to A     |
   * |    A     | deposit|  0.3   |  700  ||   933.333 |     1.5      |   1400     |    0       | transfer from B   |
   * |    A     | deposit|  0.5   |  800  ||   900     |     2.0      |   1800     |    0       | gift from someone |
   * |    A     |   ask  |  0.4   |  500  ||   900     |     1.6      |   1440     |  -160      | negative gain     |
   * |    A     |   ask  |  1.0   | 1200  ||   900     |     0.6      |    540     |   140      | positive gain     |
   * |    A     |   bid  |  0.4   | 1200  ||  1020     |     1.0      |   1020     |   140      |                   |
   * |    A     |withdraw|  0.5   | 1500  ||  1020     |     0.5      |    510     |   380      | purchase          |
   * |    A     |withdraw|  0.2   | 1500  ||  1020     |     0.3      |    306     |    0       | to cold storage   |
   */
  const report = target.getCoinReport(state, { coin: 'mixed' });
  const reportExpected = Map({
    'mixed-0': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed-1': new TradeStat({
      averageCost: toFixed((1000 + 400) / 1.5, 5),
      totalAmount: 1.5,
      totalCost: 1400,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed-2': new TradeStat({
      averageCost: toFixed((1000 + 400) / 1.5, 5),
      totalAmount: 1.5,
      totalCost: 1400,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed-3': new TradeStat({
      averageCost: toFixed((1000 + 400) / 1.5, 5),
      totalAmount: 1.5,
      totalCost: 1400,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed-4': new TradeStat({
      averageCost: 900,
      totalAmount: 2.0,
      totalCost: 1400 + 400,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed-5': new TradeStat({
      averageCost: 900,
      totalAmount: 1.6,
      totalCost: 1440,
      totalCommission: 0,
      totalGain: -160,
    }),
    'mixed-6': new TradeStat({
      averageCost: 900,
      totalAmount: 0.6,
      totalCost: 540,
      totalCommission: 0,
      totalGain: 140,
    }),
    'mixed-7': new TradeStat({
      averageCost: 1020,
      totalAmount: 1.0,
      totalCost: 540 + 480,
      totalCommission: 0,
      totalGain: 140,
    }),
    'mixed-8': new TradeStat({
      averageCost: 1020,
      totalAmount: 0.5,
      totalCost: 510,
      totalCommission: 0,
      totalGain: 380,
    }),
    'mixed-9': new TradeStat({
      averageCost: 1020,
      totalAmount: 0.5,
      totalCost: 510,
      totalCommission: 0,
      totalGain: 380,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});

test('getCoinReport: mixed2', (t) => {
  /**
   * Mixed transactions that have bids and asks between transferring coins
   *
   * Transaction Details:
   *
   * | Exchange | Action | Amount | Price || Ave. Cost | Total Amount | Total Cost | Total Gain |      Note         |
   * |----------|--------|--------|-------||-----------|--------------|------------|------------|-------------------|
   * |    A     |   bid  |  1.0   | 1000  ||  1000     |     1.0      |   1000     |    0       |                   |
   * |    A     |withdraw|  0.5   |  800  ||  1000     |     1.0      |   1000     |    0       | transfer to B     |
   * |    A     |   bid  |  1.0   |  500  ||   750     |     2.0      |   1500     |    0       | bid bet. transfer |
   * |    A     |   ask  |  0.5   |  700  ||   750     |     1.5      |   1125     |   -25      | ask bet. transfer |
   * |    B     | deposit|  0.5   |  800  ||   750     |     1.5      |   1125     |   -25      | transfer from A   |
   */
  const report = target.getCoinReport(state, { coin: 'mixed2' });
  const reportExpected = Map({
    'mixed2-0': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed2-1': new TradeStat({
      averageCost: 1000,
      totalAmount: 1.0,
      totalCost: 1000,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed2-2': new TradeStat({
      averageCost: 750,
      totalAmount: 2.0,
      totalCost: 1500,
      totalCommission: 0,
      totalGain: 0,
    }),
    'mixed2-3': new TradeStat({
      averageCost: 750,
      totalAmount: 1.5,
      totalCost: 1125,
      totalCommission: 0,
      totalGain: -25,
    }),
    'mixed2-4': new TradeStat({
      averageCost: 750,
      totalAmount: 1.5,
      totalCost: 1125,
      totalCommission: 0,
      totalGain: -25,
    }),
  });
  t.true(Map.isMap(report));
  t.false(OrderedMap.isOrderedMap(report));
  t.deepEqual(report.toJS(), reportExpected.toJS());
});
