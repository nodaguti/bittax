import { put, take, call } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import {
  appendActivity,
  updateActivity,
  removeActivity,
} from '../actions';

function createProgressChannel([context, func], ...args) {
  return eventChannel((emit) => {
    const emitter = context[func].call(context, ...args);

    emitter.on('progress', ({ done, total }) => emit({ done, total }));
    emitter.on('error', (err) => { emit({ err }); emit(END); });
    emitter.on('end', (data) => { emit({ data }); emit(END); });

    // unfortunately there is no way aborting fetch requests right now.
    const unsubscribe = () => ({});
    return unsubscribe;
  });
}

export default function* fetchWithRequestHandling({ id, title }, [context, func], ...args) {
  yield put(appendActivity({ id, title }));

  const progressChannel = yield call(createProgressChannel, [context, func], ...args);

  try {
    while (true) {
      const { data, done, total, err } = yield take(progressChannel);

      if (err) {
        throw err;
      }

      if (data) {
        return data;
      }

      yield put(updateActivity({ id, done, total }));
    }
  } finally {
    yield put(removeActivity(id));
  }
}
