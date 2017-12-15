import { Record, Map } from 'immutable';

export const ImmutableError = new Record({
  name: '',
  message: '',
  details: {
    name: '',
    message: '',
    stack: '',
  },
}, 'error');

export const Notification = new Record({
  id: '',
  type: 'info', // same as <Alert>'s bsStyle of react-bootstrap
  message: '',
  removable: true,
  ephemeral: true, // if true, automatically removed when the route is changed
}, 'notification');

export const Activity = new Record({
  id: '',
  title: '',
  description: '',
  total: 0,
  done: 0,
}, 'activity');

export const OAuthToken = new Record({
  provider: '',
  token: '',
  refreshToken: '',
  expire: 0,
}, 'oauth-token');

export const Transaction = new Record({
  provider: '',
  id: '', // provider-specific id
  timestamp: 0, // Unix Timestamp [ms]
  base: '',
  quoted: '',
  action: '', // bid, ask, withdraw, deposit
  amount: 0,
  price: {
    jpy: 0,
  },
  commission: {
    jpy: 0,
  },
  address: '',
  reports: {
    provider: {
      averageCost: 0,
      totalAmount: 0,
      totalCost: 0,
      totalGain: 0,
    },
    coin: {
      averageCost: 0,
      totalAmount: 0,
      totalCost: 0,
      totalGain: 0,
    },
  },
}, 'transaction');
