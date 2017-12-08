import { take, put, fork, select } from 'redux-saga/effects';
import {
  ROUTE_CHANGED,
  removeNotifications,
} from '../actions';

function* clearEphemeralNotificationsOnRouteChanged() {
  while (true) {
    yield take(ROUTE_CHANGED);

    const notifications = select((state) => state.notifications);
    const idsToRemove = notifications
      .filter((item) => item.ephemeral)
      .keySeq();

    yield put(removeNotifications(idsToRemove));
  }
}

export default function* notificationSaga() {
  yield fork(clearEphemeralNotificationsOnRouteChanged);
}
