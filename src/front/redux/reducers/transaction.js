import { Map, List } from 'immutable';
import { TRANSACTIONS_FETCHED } from '../actions';
import { Transactions, Transaction } from '../records';

const initialState = new Map();

const reducers = {
  [TRANSACTIONS_FETCHED](state, { provider, transactionsMap }) {
    return state.withMutations((mutableState) => {
      if (!mutableState.has(provider)) {
        mutableState.set(
          provider,
          new Transactions({
            fetchedAt: Date.now(),
          }),
        );
      }

      transactionsMap.forEach((entries, currencyPair) => {
        if (!mutableState.get(provider).transactions.has(currencyPair)) {
          mutableState.setIn(
            [provider, 'transactions', currencyPair],
            new List(),
          );
        }

        mutableState.updateIn(
          [provider, 'transactions', currencyPair],
          (list) => list.push(entries.map((entry) => new Transaction(entry))),
        );
      });
    });
  },
};

export default function transaction(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
