import { fork } from 'redux-saga/effects';
import integrationSaga from './integration';
import oAuthSaga from './oauth';
import apiSaga from './api';
import tradeSaga from './trade';
import i18nSaga from './i18n';
import errorSaga from './error';

export default function* rootSaga() {
  yield fork(integrationSaga);
  yield fork(oAuthSaga);
  yield fork(apiSaga);
  yield fork(tradeSaga);
  yield fork(i18nSaga);
  yield fork(errorSaga);
}
