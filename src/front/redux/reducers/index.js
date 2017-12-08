import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/es/storage';
import * as records from '../records';
import oauth from './oauth';
import transaction from './transaction';
import notifications from './notifications';
import error from './error';

const persistConfig = {
  transforms: [immutableTransform({ records: Object.values(records) })],
  key: 'root',
  storage,
  blacklist: ['error', 'notifications'],
};

export default persistReducer(persistConfig, combineReducers({
  oauth,
  transaction,
  notifications,
  error,
}));
