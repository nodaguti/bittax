import { Record, Map } from 'immutable';
import { strategies, reportCurrencies, tradeActions } from '../constants';

export const ImmutableError = new Record(
  {
    name: '',
    message: '',
    details: {
      name: '',
      message: '',
      stack: '',
    },
  },
  'error',
);

export const Notification = new Record(
  {
    id: '',
    type: 'info', // same as <Alert>'s bsStyle of react-bootstrap
    message: '',
    removable: true,
    ephemeral: true, // if true, automatically removed when the route is changed
  },
  'notification',
);

export const Activity = new Record(
  {
    id: '',
    title: '',
    description: '',
    total: 0,
    done: 0,
  },
  'activity',
);

export const OAuthToken = new Record(
  {
    provider: '',
    token: '',
    refreshToken: '',
    expire: 0,
  },
  'oauth-token',
);

export const Transaction = new Record(
  {
    provider: '',
    id: '', // provider-specific id
    timestamp: 0, // Unix Timestamp [ms]
    base: '',
    quoted: '',
    action: tradeActions.UNKNOWN, // constants.tradeActions
    isTransfer: false,
    amount: 0,
    price: Map(), // [currency]: price
    commission: Map(), // [currency]: amount
    address: '',
  },
  'transaction',
);

export const TradeStat = new Record(
  {
    averageCost: 0,
    totalAmount: 0,
    totalCost: 0,
    totalCommission: 0,
    totalGain: 0,
  },
  'trade-stat',
);

export const Report = new Record(
  {
    strategy: strategies.MOVING_AVERAGE,
    reportCurrency: reportCurrencies.JPY,
    processing: false,
    total: new TradeStat(), // Only total{Cost, Commission, Gain} are to be used.
    coins: Map(), // [coin]: Map<[transactionKey]: TradeStat>
    providers: Map(), // [providerId]: Map<[coin]: Map<[transactionKey]: TradeStat>>
    unrealised: {
      total: 0,
      coins: Map(), // [coin]: unrealisedGain
      providers: Map(), // [providerId]: unrealisedGain,
    },
  },
  'report',
);
