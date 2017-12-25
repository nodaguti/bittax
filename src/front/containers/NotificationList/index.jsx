import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, onlyUpdateForKeys } from 'recompose';
import NotificationPanel from '../../components/NotificationPanel';
import { removeNotification } from '../../redux/actions';

const NotificationList = compose(
  connect(
    (state) => ({
      notifications: state.notifications,
    }),
    (dispatch) => ({
      remove: bindActionCreators(removeNotification, dispatch),
    }),
  ),
  onlyUpdateForKeys(['notifications']),
)(({ notifications, remove }) =>
  notifications
    .map((notification) => {
      const { id, type, message, removable } = notification;

      return removable ? (
        <NotificationPanel key={id} {...{ id, type, message, remove }} />
      ) : (
        <NotificationPanel key={id} {...{ id, type, message }} />
      );
    })
    .valueSeq()
    .toArray(),
);

export default NotificationList;
