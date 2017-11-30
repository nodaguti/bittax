import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import { createLogger } from 'redux-logger';
import { Iterable } from 'immutable';
import transit from 'transit-immutable-js';
import * as reducers from '../reducers';
import * as records from '../records';

const recordTransit = transit.withRecords([
  ...records,
]);

const localStorageConfig = {
  serialize: (subset) => recordTransit.toJSON(subset),
  deserialize: (serializedData) => recordTransit.fromJSON(serializedData),
};

const stateTransformer = (state) => {
  if (Iterable.isIterable(state)) {
    return state.toJS();
  }
  return state;
};

export default function configureStore(initialState = {}) {
  const middlewares = [thunk];

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      stateTransformer,
      duration: true,
      diff: true,
    });

    middlewares.push(logger);
  }

  const createPersistentStore = compose(
    persistState(null, localStorageConfig),
    applyMiddleware(...middlewares),
  )(createStore);

  const rootReducer = combineReducers(reducers);

  return createPersistentStore(rootReducer, initialState);
}
