import { take, put, fork } from 'redux-saga/effects';
import {
  ROUTE_CHANGED,
  EMIT_ERROR,
  emitMaskedError,
  clearError,
} from '../../actions';

function* maskErrorDetails() {
  while (true) {
    let { payload } = yield take(EMIT_ERROR);

    if (process.env.NODE_ENV !== 'development') {
      payload = payload.set('details', '');
    }

    yield put(emitMaskedError(payload));
  }
}

function* clearErrorOnRouteChanged() {
  while (true) {
    yield take(ROUTE_CHANGED);
    yield put(clearError());
  }
}

export default function* errorSaga() {
  yield fork(maskErrorDetails);
  yield fork(clearErrorOnRouteChanged);
}
