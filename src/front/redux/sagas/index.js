import { fork } from 'redux-saga/effects';
import integrationSaga from './integration';
import oAuthSaga from './oauth';
import apiSaga from './api';
import tradeSaga from './trade';
import errorSaga from './error';

export default function* rootSaga() {
  yield fork(integrationSaga);
  yield fork(oAuthSaga);
  yield fork(apiSaga);
  yield fork(tradeSaga);
  yield fork(errorSaga);
}
