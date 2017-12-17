import React from 'react';
import { Message, Close } from 'rebass';

const colourPalette = {
  info: 'blue',
  warning: 'orange',
  success: 'green',
};

const NotificationPanel = ({ type, message, remove }) =>
  remove ? (
    <Message my={2} bg={colourPalette[type]} onDismiss={remove}>
      {message}
      <Close ml="auto" onClick={remove} />
    </Message>
  ) : (
    <Message my={2} bg={colourPalette[type]}>
      {message}
    </Message>
  );

export default NotificationPanel;
