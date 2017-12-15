import { createSelector } from 'reselect';

const getNotifications = (state) => state.notifications;

const getEphemeralNotifications = createSelector(
  getNotifications,
  (notifications) => notifications.filter((item) => item.ephemeral),
);

export const getEphemeralNotificationIds = createSelector(
  getEphemeralNotifications,
  (notifications) => notifications.keySeq(),
);
