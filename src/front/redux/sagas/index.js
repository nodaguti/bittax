import { fork, take, put } from 'redux-saga/effects';
import { EMIT_ERROR, emitMaskedError } from '../actions';

function* errorSaga() {
  let { payload } = yield take(EMIT_ERROR);

  if (process.env.NODE_ENV !== 'development') {
    payload = payload.set('details', '');
  }

  yield put(emitMaskedError(payload));
}

export default function* rootSaga() {
  yield fork(errorSaga);
}
