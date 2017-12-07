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

export const OAuthToken = new Record({
  provider: '',
  token: '',
  refreshToken: '',
  expire: 0,
}, 'oauth-token');

export const Transactions = new Record({
  fetchedAt: 0,
  transactions: new Map(), // [currency_pair]: List<Transaction>
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
  address: 0,
}, 'transaction');
