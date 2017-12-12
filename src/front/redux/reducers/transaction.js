import { Map, OrderedMap } from 'immutable';
import { TRANSACTIONS_FETCHED } from '../actions';
import { Transactions, Transaction } from '../records';

const initialState = new Map(); // [provider]: Transactions

const reducers = {
  [TRANSACTIONS_FETCHED](state, {
    provider,
    fetchedAt,
    transactionsMap,
  }) {
    return state.withMutations((mutableState) => {
      if (!mutableState.has(provider)) {
        mutableState.set(
          provider,
          new Transactions(),
        );
      }

      mutableState.setIn([provider, 'fetchedAt'], fetchedAt);

      transactionsMap.forEach((entries, currencyPair) => {
        if (!mutableState.get(provider).transactions.has(currencyPair)) {
          mutableState.setIn(
            [provider, 'transactions', currencyPair],
            new OrderedMap(),
          );
        }

        mutableState.updateIn(
          [provider, 'transactions', currencyPair],
          (map) => (
            map.withMutations((mutableMap) => {
              entries.forEach((entry) => {
                const key = `${entry.timestamp}-${entry.action}`;

                mutableMap.set(key, new Transaction(entry));
              });
            })
          ),
        );
      });
    });
  },
};

export default function transaction(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
