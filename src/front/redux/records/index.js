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

export const Transactions = new Record({
  fetchedAt: 0,
  transactions: new Map(), // [currency_pair]: OrderedMap<[id]: Transaction>
}, 'transactions');

export const Transaction = new Record({
  id: '',
  timestamp: 0,
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
    all: {
      averageCost: 0,
      gain: 0,
    },
  },
}, 'transaction');
