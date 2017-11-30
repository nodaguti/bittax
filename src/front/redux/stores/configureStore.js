import { Iterable } from 'immutable';
import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/es/storage';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import * as reducers from '../reducers';
import * as records from '../records';

const persistConfig = {
  transforms: [immutableTransform({ records: [...records] })],
  key: 'root',
  storage,
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

  const reducer = combineReducers(reducers);
  const persistedReducer = persistReducer(persistConfig, reducer);
  const store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares)),
  );

  return persistStore(store);
}
