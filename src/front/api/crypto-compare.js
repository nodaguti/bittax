import Bottleneck from 'bottleneck';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import { Map } from 'immutable';
import { monkey as useRound } from 'moment-round';
import { last } from 'lodash-es';
import { URLSearchParams } from 'url';

useRound(moment);

const limiter = new Bottleneck(5, 3100); // 6000 requests per hour

class Cache {
  cache = new Map();

  has({ base, quoted, timestamp }) {
    return this.cache.has(`${base}-${quoted}-${timestamp}`);
  }

  get({ base, quoted, timestamp }) {
    return this.cache.get(`${base}-${quoted}-${timestamp}`);
  }

  set({ base, quoted, data }) {
    this.cache = this.cache.withMutations((mutableMap) => {
      data.forEach(({ time, ...pricesAndVolumes }) => {
        mutableMap.set(`${base}-${quoted}-${time}`, pricesAndVolumes);
      });
    });
  }
}

const cache = new Cache();

const fetchAPI = async (url, { params, ...opts } = {}) => {
  const searchParams = new URLSearchParams(params);
  const res = await limiter.schedule(fetch, `${url}?${searchParams.toString()}`, opts);
  const json = await res.json();

  if (json.Reponse !== 'Success') {
    throw new Error(`${json.Message}: type ${json.Type}`);
  }

  return json.Data;
};

class PublicAPI {
  static async fetchPriceAt({
    base,
    quoted,
    provider,
    timestamp,
  }) {
    // As CryptoCompare only provides historical price data as hourly,
    // we use the close price of a timeframe which the given timestamp is in.
    const hourlyFlooredUnixTimestamp = moment(timestamp).floor(1, 'hours').unix();
    const cacheQuery = { base, quoted, timestamp: hourlyFlooredUnixTimestamp };

    if (cache.has(cacheQuery)) {
      const { close: price } = cache.get(cacheQuery);

      return Promise.resolve(price);
    }

    const data = await fetchAPI('https://min-api.cryptocompare.com/data/histohour', {
      params: {
        fsym: base.toUpperCase(base),
        tsym: quoted.toUpperCase(quoted),
        limit: 24,
        toTs: hourlyFlooredUnixTimestamp,
        e: provider,
      },
    });

    const pricesAtTheTime = last(data);

    if (pricesAtTheTime.time !== hourlyFlooredUnixTimestamp) {
      const humanReadableTimestamp = moment(timestamp).format();
      const humanReadableHourlyFlooredUnixTimestamp =
        moment().unix(hourlyFlooredUnixTimestamp).format();
      const args = {
        base,
        quoted,
        provider,
        timestamp,
        humanReadableTimestamp,
        hourlyFlooredUnixTimestamp,
        humanReadableHourlyFlooredUnixTimestamp,
      };

      console.error('No data available', args, data);
      throw new Error('No data available');
    }

    cache.set({ base, quoted, data });

    return pricesAtTheTime.close;
  }
}

export default {
  public: PublicAPI,
};
