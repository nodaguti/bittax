import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/es/storage';
import * as records from '../../records';
import oauth from './oauth';
import transactions from './transactions';
import report from './report';
import notifications from './notifications';
import activities from './activities';
import locale from './locale';
import error from './error';

const persistConfig = {
  transforms: [immutableTransform({ records: Object.values(records) })],
  key: 'root',
  storage,
  blacklist: ['error', 'notifications', 'activities'],
};

export default persistReducer(
  persistConfig,
  combineReducers({
    oauth,
    transactions,
    report,
    notifications,
    activities,
    locale,
    error,
  }),
);
