import { Iterable } from 'immutable';
import { applyMiddleware, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistedReducer from './reducers';
import rootSaga from './sagas';
import { rehydrationCompleted } from './actions';

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
