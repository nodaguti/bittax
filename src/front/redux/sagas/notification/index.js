import { take, put, fork, select } from 'redux-saga/effects';
import {
  ROUTE_CHANGED,
  removeNotifications,
} from '../../actions';
import { getEphemeralNotificationIds } from '../../../selectors/notificationSelectors';

function* clearEphemeralNotificationsOnRouteChanged() {
  while (true) {
    yield take(ROUTE_CHANGED);

    const ephemeralNotifications = yield select(getEphemeralNotificationIds);

    yield put(removeNotifications(ephemeralNotifications));
  }
}

export default function* notificationSaga() {
  yield fork(clearEphemeralNotificationsOnRouteChanged);
}
