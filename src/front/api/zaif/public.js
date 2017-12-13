import fetch from './fetch';

export default class Public {
  static async fetchCurrencies() {
    const data = await fetch('https://api.zaif.jp/api/1/currencies/all');
    return data.map((currencyObj) => currencyObj.name);
  }

  static async fetchCurrencyPairs() {
    const data = await fetch('https://api.zaif.jp/api/1/currency_pairs/all');
    return data.map((pairObj) => pairObj.currency_pair);
  }
}
