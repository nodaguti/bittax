import { Map, OrderedMap } from 'immutable';
import { TRANSACTIONS_FETCHED } from '../actions';
import { Transaction } from '../../records';

const initialState = Map({
  fetchedAt: Map(), // [provider]: fetchedTimestamp
  coins: Map(), // [coin]: OrderedMap<Transaction>
});

const reducers = {
  [TRANSACTIONS_FETCHED](state, {
    provider,
    fetchedAt,
    transactionsGroupedByCoin,
  }) {
    return state.withMutations((mutableState) => {
      mutableState.setIn(['fetchedAt', provider], fetchedAt);

      transactionsGroupedByCoin.forEach((transactionsToAppend, coin) => {
        if (!mutableState.coins.has(coin)) {
          mutableState.setIn(['coins', coin], OrderedMap());
        }

        mutableState.updateIn(
          ['coins', coin],
          (transactions) => {
            const appended = transactions.withMutations((mutableMap) => {
              transactionsToAppend.forEach((item) => {
                const transaction = new Transaction(item);
                const { id, timestamp, action } = transaction;
                const key = `${provider}-${id}-${timestamp}-${action}`;

                mutableMap.set(key, transaction);
              });
            });

            return appended.sort((a, b) => {
              const timeDiff = a.timestamp - b.timestamp;
              if (timeDiff !== 0) return timeDiff;

              if (a.provider === b.provider) {
                const aId = Number(a.id);
                const bId = Number(b.id);
                const idDiff = aId - bId;

                if (idDiff !== 0) return idDiff;
              }

              return 0;
            });
          },
        );
      });
    });
  },
};

export default function transactionsReducer(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
