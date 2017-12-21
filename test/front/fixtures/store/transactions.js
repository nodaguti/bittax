import { Map, OrderedMap } from 'immutable';
import { Transaction, TradeStat, Report } from '../../../../src/front/records';
import {
  tradeActions,
  reportCurrencies,
} from '../../../../src/front/constants';

export default {
  transactions: {
    fetchedAt: Map({
      aaa: 1513999999999,
      bbb: 1513999999999,
    }),
    coins: Map({
      [tradeActions.BID]: OrderedMap({
        'bid-0': new Transaction({
          provider: 'aaa',
          id: 'bid-0-0',
          timestamp: 1513000000000,
          base: tradeActions.BID,
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.BID]: 0.05,
            [reportCurrencies.JPY]: 50,
          }),
        }),
        'bid-1': new Transaction({
          provider: 'bbb',
          id: 'bid-0-0',
          timestamp: 1513000010000,
          base: tradeActions.BID,
          quoted: 'btc',
          action: tradeActions.BID,
          amount: 0.5,
          price: Map({
            btc: 0.003,
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.BID]: 0.05,
            [reportCurrencies.JPY]: 60,
          }),
        }),
        'bid-2': new Transaction({
          provider: 'aaa',
          id: 'bid-0-1',
          timestamp: 1513000020000,
          base: tradeActions.BID,
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 0.8,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.BID]: 0.05,
            [reportCurrencies.JPY]: 40,
          }),
        }),
      }),
      [tradeActions.ASK]: OrderedMap({
        'ask-0': new Transaction({
          provider: 'aaa',
          id: 'ask-0-0',
          timestamp: 1513000000000,
          base: tradeActions.ASK,
          quoted: reportCurrencies.JPY,
          action: tradeActions.ASK,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.ASK]: 0.05,
            [reportCurrencies.JPY]: 50,
          }),
        }),
        'ask-1': new Transaction({
          provider: 'bbb',
          id: 'ask-0-0',
          timestamp: 1513000010000,
          base: tradeActions.ASK,
          quoted: 'btc',
          action: tradeActions.ASK,
          amount: 0.5,
          price: Map({
            btc: 0.003,
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.ASK]: 0.05,
            [reportCurrencies.JPY]: 60,
          }),
        }),
        'ask-2': new Transaction({
          provider: 'aaa',
          id: 'ask-0-1',
          timestamp: 1513000020000,
          base: tradeActions.ASK,
          quoted: reportCurrencies.JPY,
          action: tradeActions.ASK,
          amount: 0.8,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.ASK]: 0.05,
            [reportCurrencies.JPY]: 40,
          }),
        }),
      }),
      [tradeActions.DEPOSIT]: OrderedMap({
        'deposit-0': new Transaction({
          provider: 'aaa',
          id: 'deposit-0-0',
          timestamp: 1513000000000,
          base: tradeActions.DEPOSIT,
          action: tradeActions.DEPOSIT,
          amount: 1.0,
          isTransfer: false,
          price: Map({
            [tradeActions.DEPOSIT]: 1,
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.DEPOSIT]: 0.05,
            [reportCurrencies.JPY]: 50,
          }),
        }),
        'deposit-1': new Transaction({
          provider: 'bbb',
          id: 'deposit-0-0',
          timestamp: 1513000010000,
          base: tradeActions.DEPOSIT,
          action: tradeActions.DEPOSIT,
          amount: 0.5,
          isTransfer: true,
          price: Map({
            [tradeActions.DEPOSIT]: 1,
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.DEPOSIT]: 0.05,
            [reportCurrencies.JPY]: 60,
          }),
        }),
      }),
      [tradeActions.WITHDRAW]: OrderedMap({
        'withdraw-prepare': new Transaction({
          provider: 'aaa',
          id: 'withdraw-0-prepare',
          timestamp: 1513000000000,
          base: tradeActions.WITHDRAW,
          action: tradeActions.BID,
          amount: 2.0,
          price: Map({
            [tradeActions.WITHDRAW]: 1,
            [reportCurrencies.JPY]: 500,
          }),
          commission: Map({
            [tradeActions.WITHDRAW]: 0.05,
            [reportCurrencies.JPY]: 25,
          }),
        }),
        'withdraw-0': new Transaction({
          provider: 'aaa',
          id: 'withdraw-0-0',
          timestamp: 1513000000000,
          base: tradeActions.WITHDRAW,
          action: tradeActions.WITHDRAW,
          amount: 1.0,
          isTransfer: false,
          price: Map({
            [tradeActions.WITHDRAW]: 1,
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.WITHDRAW]: 0.05,
            [reportCurrencies.JPY]: 50,
          }),
        }),
        'withdraw-1': new Transaction({
          provider: 'bbb',
          id: 'withdraw-0-0',
          timestamp: 1513000010000,
          base: tradeActions.WITHDRAW,
          action: tradeActions.WITHDRAW,
          amount: 0.5,
          isTransfer: true,
          price: Map({
            [tradeActions.WITHDRAW]: 1,
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.WITHDRAW]: 0.05,
            [reportCurrencies.JPY]: 60,
          }),
        }),
      }),
      mixed: OrderedMap({
        'mixed-0': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-0',
          timestamp: 1513000000000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-1': new Transaction({
          provider: 'bbb',
          id: 'mixed-0-0',
          timestamp: 1513000010000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-2': new Transaction({
          provider: 'bbb',
          id: 'mixed-0-1',
          timestamp: 1513000020000,
          base: 'mixed',
          action: tradeActions.WITHDRAW,
          isTransfer: true,
          amount: 0.3,
          price: Map({
            [reportCurrencies.JPY]: 900,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-3': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-1',
          timestamp: 1513000030000,
          base: 'mixed',
          action: tradeActions.DEPOSIT,
          isTransfer: true,
          amount: 0.3,
          price: Map({
            [reportCurrencies.JPY]: 700,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-4': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-2',
          timestamp: 1513000040000,
          base: 'mixed',
          action: tradeActions.DEPOSIT,
          isTransfer: false,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-5': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-3',
          timestamp: 1513000050000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.ASK,
          amount: 0.4,
          price: Map({
            [reportCurrencies.JPY]: 500,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-6': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-4',
          timestamp: 1513000060000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.ASK,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-7': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-5',
          timestamp: 1513000070000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 0.4,
          price: Map({
            [reportCurrencies.JPY]: 1200,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-8': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-6',
          timestamp: 1513000080000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.WITHDRAW,
          isTransfer: false,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 1500,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed-9': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-7',
          timestamp: 1513000090000,
          base: 'mixed',
          quoted: reportCurrencies.JPY,
          action: tradeActions.WITHDRAW,
          isTransfer: true,
          amount: 0.2,
          price: Map({
            [reportCurrencies.JPY]: 1500,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
      }),
      mixed2: OrderedMap({
        'mixed2-0': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-0',
          timestamp: 1513000000000,
          base: 'mixed2',
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 1000,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed2-1': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-1',
          timestamp: 1513000010000,
          base: 'mixed2',
          quoted: reportCurrencies.JPY,
          action: tradeActions.WITHDRAW,
          isTransfer: true,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed2-2': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-2',
          timestamp: 1513000020000,
          base: 'mixed2',
          quoted: reportCurrencies.JPY,
          action: tradeActions.BID,
          amount: 1.0,
          price: Map({
            [reportCurrencies.JPY]: 500,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed2-3': new Transaction({
          provider: 'aaa',
          id: 'mixed-0-3',
          timestamp: 1513000030000,
          base: 'mixed2',
          quoted: reportCurrencies.JPY,
          action: tradeActions.ASK,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 700,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
        'mixed2-4': new Transaction({
          provider: 'bbb',
          id: 'mixed-0-0',
          timestamp: 1513000040000,
          base: 'mixed2',
          quoted: reportCurrencies.JPY,
          action: tradeActions.DEPOSIT,
          isTransfer: true,
          amount: 0.5,
          price: Map({
            [reportCurrencies.JPY]: 800,
          }),
          commission: Map({
            [tradeActions.BID]: 0,
            [reportCurrencies.JPY]: 0,
          }),
        }),
      }),
      short: OrderedMap({}),
    }),
  },
  report: new Report(),
};
