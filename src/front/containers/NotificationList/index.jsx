import React from 'react';
import { connect } from 'react-redux';
import NotificationPanel from '../../components/NotificationPanel';
import { removeNotification } from '../../redux/actions';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

const NotificationList = ({ notifications, dispatch }) =>
  notifications
    .map((notification) => {
      const { id, type, message, removable } = notification;
      const remove = () => dispatch(removeNotification(id));

      return removable ? (
        <NotificationPanel key={id} {...{ type, message, remove }} />
      ) : (
        <NotificationPanel key={id} {...{ type, message }} />
      );
    })
    .valueSeq()
    .toArray();

export default connect(mapStateToProps)(NotificationList);
