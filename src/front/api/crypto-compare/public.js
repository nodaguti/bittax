import moment from 'moment';
import { Map } from 'immutable';
import { monkey as useRound } from 'moment-round';
import { last } from 'lodash-es';
import fetch from './fetch';

useRound(moment);

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

export default class Public {
  static async fetchPriceAt({ base, quoted, provider, timestamp }) {
    // As CryptoCompare only provides historical price data as hourly,
    // we use the close price of a timeframe which the given timestamp is in.
    const hourlyFlooredUnixTimestamp = moment(timestamp)
      .floor(1, 'hours')
      .unix();
    const cacheQuery = { base, quoted, timestamp: hourlyFlooredUnixTimestamp };

    if (cache.has(cacheQuery)) {
      const { close: price } = cache.get(cacheQuery);

      return Promise.resolve(price);
    }

    const data = await fetch(
      'https://min-api.cryptocompare.com/data/histohour',
      {
        params: {
          fsym: base.toUpperCase(base),
          tsym: quoted.toUpperCase(quoted),
          limit: 24,
          toTs: hourlyFlooredUnixTimestamp,
          e: provider,
        },
      },
    );

    const pricesAtTheTime = last(data);

    if (pricesAtTheTime.time !== hourlyFlooredUnixTimestamp) {
      const humanReadableTimestamp = moment(timestamp).format();
      const humanReadableHourlyFlooredUnixTimestamp = moment()
        .unix(hourlyFlooredUnixTimestamp)
        .format();
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
