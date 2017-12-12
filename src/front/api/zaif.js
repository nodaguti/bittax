import { EventEmitter } from 'events';
import Bottleneck from 'bottleneck';
import uuidv4 from 'uuid/v4';
import { merge } from 'lodash-es';
import { Map } from 'immutable';
import Nonce from './utils/nonce';
import fetch from './utils/proxied-fetch';

const CLIENT_ID = '08b30c2a9afb48d6be42a511f9186cc3';
const CLIENT_SECRET = 'c7a70886878c4aa0bbd7afa815de35bc';

const fetchLimiter = new Bottleneck(1, 3500);
const enqueueLimiter = new Bottleneck(1);
const nonce = new Nonce();

const parseCurrencyPair = (currencyPair) => {
  const [base, quoted] = currencyPair.toLowerCase().split('_');
  return { base, quoted };
};

/**
 * This func should be called via `enqueueLimiter#schedule`
 * to make sure `nonce#next` is never executed concurrently
 */
const enqueueFetch = (url, { params, ...opts } = {}, isPrivate = false) => {
  if (isPrivate) {
    const n = nonce.next() / 1e14;

    // eslint-disable-next-line no-param-reassign
    params = Object.assign({}, params, { nonce: n });
  }

  if (params) {
    const searchParams = new URLSearchParams(params);

    // eslint-disable-next-line no-param-reassign
    opts = merge({}, opts, {
      method: 'POST',
      body: searchParams,
    });
  }

  return fetchLimiter.schedule(fetch, url, opts);
};

const fetchAPI = async (url, { params, ...opts } = {}, isPrivate = false) => {
  const req = enqueueLimiter.schedule(enqueueFetch, url, { params, ...opts }, isPrivate);
  const res = await req;
  const resForErrorHandling = res.clone();

  try {
    const json = await res.json();

    if (!isPrivate) {
      return json;
    }

    if (json.success !== 1) {
      const retryableMessages = [
        'time wait restriction, please try later.',
        'nonce not incremented',
      ];
      const message = json.return || res.headers.get('x-message');

      if (retryableMessages.includes(message)) {
        console.warn(`Retry: "${message}" from ${url} (params: ${JSON.stringify({ params, ...opts })})`);
        return fetchAPI(url, { params, ...opts }, isPrivate);
      }

      throw new Error(`Server Error: ${message}`);
    }

    return json.return;
  } catch (ex) {
    const text = await resForErrorHandling.text();

    if (text.includes('Bad Gateway')) {
      console.warn(`Retry: Got the following from ${url} (params: ${JSON.stringify({ params, ...opts })}):\n\n${text}`);
      return fetchAPI(url, { params, ...opts }, isPrivate);
    }

    console.error(`Got the following from ${url} (params: ${JSON.stringify({ params, ...opts })}):\n\n${text}`);
    throw ex;
  }
};

class OAuthAPI {
  static openAuthWindow() {
    const url = 'https://zaif.jp/oauth';
    const state = uuidv4();
    const params = {
      client_id: CLIENT_ID,
      response_type: 'code',
      scope: 'info',
      state,
      redirect_uri: `${window.location.origin}/oauth/zaif`,
    };
    const searchParams = new URLSearchParams(params);
    const authWin = window.open(`${url}?${searchParams.toString()}`);

    return { state, authWin };
  }

  static async fetchToken({ code }) {
    const data = await fetchAPI('https://oauth.zaif.jp/v1/token', {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: `${window.location.origin}/oauth/zaif`,
      },
    });

    return {
      state: data.state,
      token: data.access_token,
      refreshToken: data.refresh_token,
      expire: Date.now() + (Number(data.expires_in) * 1000),
    };
  }

  static async refreshToken({ refreshToken }) {
    const data = await fetchAPI('https://oauth.zaif.jp/v1/refresh_token', {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    return {
      token: data.access_token,
      refreshToken: data.refresh_token,
      expire: Date.now() + (Number(data.expires_in) * 1000),
    };
  }
}

class PublicAPI {
  static async fetchCurrencies() {
    const data = await fetchAPI('https://api.zaif.jp/api/1/currencies/all');
    return data.map((currencyObj) => currencyObj.name);
  }

  static async fetchCurrencyPairs() {
    const data = await fetchAPI('https://api.zaif.jp/api/1/currency_pairs/all');
    return data.map((pairObj) => pairObj.currency_pair);
  }
}

class PrivateAPI {
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

    const trades = await fetchAPI('https://api.zaif.jp/tapi', {
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

    const withdrawals = await fetchAPI('https://api.zaif.jp/tapi', {
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

    const deposits = await fetchAPI('https://api.zaif.jp/tapi', {
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

export default {
  oAuth: OAuthAPI,
  public: PublicAPI,
  private: new PrivateAPI(),
};
