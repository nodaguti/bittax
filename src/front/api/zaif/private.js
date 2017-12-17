import { EventEmitter } from 'events';
import { Map } from 'immutable';
import PublicAPI from './public';
import fetch from './fetch';
import { parseCurrencyPair } from './utils';
import providers from '../../providers';
import { Transaction } from '../../records';
import { tradeActions } from '../../constants';

const providerId = providers.zaif.id;

export default class Private {
  token = null;

  constructor(token) {
    if (token) {
      this.token = token;
    }
  }

  setToken(token) {
    this.token = token;
  }

  async fetchTradesOfCurrencyPair({ currencyPair }, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    const trades = await fetch(
      'https://api.zaif.jp/tapi',
      {
        headers: {
          token: this.token,
        },
        params: {
          method: 'trade_history',
          currency_pair: currencyPair,
          since: lastFetchedAt,
        },
      },
      true,
    );

    const { base, quoted } = parseCurrencyPair(currencyPair);

    return Object.entries(trades).map(
      ([orderId, trade]) =>
        new Transaction({
          provider: providerId,
          id: orderId,
          timestamp: trade.timestamp * 1000,
          base,
          quoted,
          action: tradeActions[trade.action.toUpperCase()],
          amount: trade.amount,
          price: Map({
            [base]: 1,
            [quoted]: trade.price,
          }),
          commission: Map({
            [base]: trade.fee - trade.bonus,
          }),
        }),
    );
  }

  fetchTrades(_, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    // We use EventEmitter to provide progress information.
    // async/await is not very useful here as it is for returning a value only once.
    // Streams API could be another option but its usage is rather
    // creating a large consistent data flow, whereas we want to return
    // two different types of data: request progress and fetched data.
    const emitter = new EventEmitter();

    (async () => {
      try {
        const pairs = await PublicAPI.fetchCurrencyPairs();
        const total = pairs.length + 1; // add one to take `fetchCurrencyPairs` into account
        let done = 1;

        emitter.emit('progress', { done, total });

        const promises = pairs.map((currencyPair) =>
          this.fetchTradesOfCurrencyPair(
            {
              currencyPair,
            },
            {
              lastFetchedAt,
            },
          ).then((data) => {
            done += 1;
            emitter.emit('progress', { done, total });

            return data;
          }),
        );

        const histories = await Promise.all(promises);
        const results = Map().withMutations((mutableMap) => {
          histories.forEach((history, idx) => {
            if (!history.length) return;

            const { base } = parseCurrencyPair(pairs[idx]);

            if (!mutableMap.has(base)) {
              mutableMap.set(base, history);
            } else {
              mutableMap.update(base, (list) => list.concat(history));
            }
          });
        });

        emitter.emit('end', results);
      } catch (ex) {
        emitter.emit('error', ex);
      }
    })();

    return emitter;
  }

  async fetchWithdrawalsOfCurrency({ currency }, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    const withdrawals = await fetch(
      'https://api.zaif.jp/tapi',
      {
        headers: {
          token: this.token,
        },
        params: {
          method: 'withdraw_history',
          currency,
          since: lastFetchedAt,
        },
      },
      true,
    );

    return Object.entries(withdrawals).map(
      ([withdrawalId, withdrawal]) =>
        new Transaction({
          provider: providerId,
          id: withdrawalId,
          timestamp: withdrawal.timestamp * 1000,
          base: currency,
          action: tradeActions.WITHDRAW,
          amount: withdrawal.amount,
          price: Map({
            [currency]: 1,
          }),
          commission: Map({
            [currency]: 0,
          }),
          address: withdrawal.address,
        }),
    );
  }

  fetchWithdrawals(_, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    const emitter = new EventEmitter();

    (async () => {
      try {
        const currencies = await PublicAPI.fetchCurrencies();
        const total = currencies.length + 1; // add one to take `fetchCurrencies` into account
        let done = 1;

        emitter.emit('progress', { done, total });

        const promises = currencies.map((currency) =>
          this.fetchWithdrawalsOfCurrency(
            {
              currency,
            },
            {
              lastFetchedAt,
            },
          ).then((data) => {
            done += 1;
            emitter.emit('progress', { done, total });

            return data;
          }),
        );

        const histories = await Promise.all(promises);
        const results = Map().withMutations((mutableMap) => {
          histories.forEach((history, idx) => {
            if (!history.length) return;

            mutableMap.set(currencies[idx], history);
          });
        });

        emitter.emit('end', results);
      } catch (ex) {
        emitter.emit('error', ex);
      }
    })();

    return emitter;
  }

  async fetchDepositsOfCurrency({ currency }, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    const deposits = await fetch(
      'https://api.zaif.jp/tapi',
      {
        headers: {
          token: this.token,
        },
        params: {
          method: 'deposit_history',
          currency,
          since: lastFetchedAt,
        },
      },
      true,
    );

    return Object.entries(deposits).map(
      ([depositId, deposit]) =>
        new Transaction({
          provider: providerId,
          id: depositId,
          timestamp: deposit.timestamp * 1000,
          base: currency,
          action: tradeActions.DEPOSIT,
          amount: deposit.amount,
          price: Map({
            [currency]: 1,
          }),
          commission: Map({
            [currency]: 0,
          }),
          address: deposit.address,
        }),
    );
  }

  fetchDeposits(_, { lastFetchedAt } = {}) {
    if (!this.token) {
      throw new Error('Available token is needed.');
    }

    const emitter = new EventEmitter();

    (async () => {
      try {
        const currencies = await PublicAPI.fetchCurrencies();
        const total = currencies.length + 1; // add one to take `fetchCurrencies` into account
        let done = 1;

        emitter.emit('progress', { done, total });

        const promises = currencies.map((currency) =>
          this.fetchDepositsOfCurrency(
            {
              currency,
            },
            {
              lastFetchedAt,
            },
          ).then((data) => {
            done += 1;
            emitter.emit('progress', { done, total });

            return data;
          }),
        );

        const histories = await Promise.all(promises);
        const results = Map().withMutations((mutableMap) => {
          histories.forEach((history, idx) => {
            if (!history.length) return;

            mutableMap.set(currencies[idx], history);
          });
        });

        emitter.emit('end', results);
      } catch (ex) {
        emitter.emit('error', ex);
      }
    })();

    return emitter;
  }
}
