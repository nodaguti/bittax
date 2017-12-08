import React from 'react';
import { Alert } from 'react-bootstrap';

const NotificationPanel = ({
  type,
  message,
  remove,
}) => (remove ? (
  <Alert bsStyle={type} onDismiss={remove}>
    <p>{message}</p>
  </Alert>
) : (
  <Alert bsStyle={type}>
    <p>{message}</p>
  </Alert>
));

export default NotificationPanel;
