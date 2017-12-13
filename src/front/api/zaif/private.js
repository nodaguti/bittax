import { EventEmitter } from 'events';
import { Map } from 'immutable';
import PublicAPI from './public';
import fetch from './fetch';
import { parseCurrencyPair } from './utils';

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

    const trades = await fetch('https://api.zaif.jp/tapi', {
      headers: {
        token: this.token,
      },
      params: {
        method: 'trade_history',
        currency_pair: currencyPair,
        since: lastFetchedAt,
      },
    }, true);

    const { base, quoted } = parseCurrencyPair(currencyPair);

    return Object.entries(trades)
      .map(([orderId, trade]) => {
        const transaction = {};

        transaction.id = orderId;
        transaction.timestamp = trade.timestamp;
        transaction.action = trade.action;
        transaction.amount = trade.amount;
        transaction.price = {
          [quoted]: trade.price,
        };
        transaction.commission = {
          [base]: trade.fee - trade.bonus,
        };

        return transaction;
      });
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

        const promises = pairs.map((currencyPair) => this.fetchTradesOfCurrencyPair({
          currencyPair,
        }, {
          lastFetchedAt,
        }).then((data) => {
          done += 1;
          emitter.emit('progress', { done, total });

          return data;
        }));

        const histories = await Promise.all(promises);
        const results = new Map(histories.map((history, idx) => {
          if (!history.length) return null;

          return [pairs[idx], history];
        }).filter((tuple) => tuple !== null));

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

    const withdrawals = await fetch('https://api.zaif.jp/tapi', {
      headers: {
        token: this.token,
      },
      params: {
        method: 'withdraw_history',
        currency,
        since: lastFetchedAt,
      },
    }, true);

    return Object.entries(withdrawals)
      .map(([withdrawalId, withdrawal]) => {
        const transaction = {};

        transaction.id = withdrawalId;
        transaction.timestamp = withdrawal.timestamp;
        transaction.action = 'withdraw';
        transaction.amount = withdrawal.amount;
        transaction.address = withdrawal.address;

        return transaction;
      });
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

        const promises = currencies.map((currency) => this.fetchWithdrawalsOfCurrency({
          currency,
        }, {
          lastFetchedAt,
        }).then((data) => {
          done += 1;
          emitter.emit('progress', { done, total });

          return data;
        }));

        const histories = await Promise.all(promises);
        const results = new Map(histories.map((history, idx) => {
          if (!history.length) return null;

          return [currencies[idx], history];
        }).filter((tuple) => tuple !== null));

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

    const deposits = await fetch('https://api.zaif.jp/tapi', {
      headers: {
        token: this.token,
      },
      params: {
        method: 'deposit_history',
        currency,
        since: lastFetchedAt,
      },
    }, true);

    return Object.entries(deposits)
      .map(([depositId, deposit]) => {
        const transaction = {};

        transaction.id = depositId;
        transaction.timestamp = deposit.timestamp;
        transaction.action = 'deposit';
        transaction.amount = deposit.amount;
        transaction.address = deposit.address;

        return transaction;
      });
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

        const promises = currencies.map((currency) => this.fetchDepositsOfCurrency({
          currency,
        }, {
          lastFetchedAt,
        }).then((data) => {
          done += 1;
          emitter.emit('progress', { done, total });

          return data;
        }));

        const histories = await Promise.all(promises);
        const results = new Map(histories.map((history, idx) => {
          if (!history.length) return null;

          return [currencies[idx], history];
        }).filter((tuple) => tuple !== null));

        emitter.emit('end', results);
      } catch (ex) {
        emitter.emit('error', ex);
      }
    })();

    return emitter;
  }
}
