import { Iterable } from 'immutable';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/es/storage';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './reducers';
import * as records from './records';
import rootSaga from './sagas';
import { rehydrationCompleted } from './actions';

const persistConfig = {
  transforms: [immutableTransform({ records: Object.values(records) })],
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
  const saga = createSagaMiddleware();
  const middlewares = [saga];

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
    composeWithDevTools(applyMiddleware(...middlewares)),
  );

  saga.run(rootSaga);

  const persistor = persistStore(store, initialState, () => {
    store.dispatch(rehydrationCompleted());
  });

  return { persistor, store };
}
