import React from 'react';
import { compose, withProps, withHandlers, onlyUpdateForKeys } from 'recompose';
import { Message, Close } from 'rebass';

const colourPalette = {
  info: 'blue',
  warning: 'orange',
  success: 'green',
};

const NotificationPanel = compose(
  withProps((props) => ({
    bg: colourPalette[props.type],
    removable: !!props.remove,
  })),
  withHandlers({
    remove: (props) => () => props.remove(props.id),
  }),
  onlyUpdateForKeys(['id']),
)(
  ({ bg, message, removable, remove }) =>
    removable ? (
      <Message my={2} bg={bg}>
        {message}
        <Close ml="auto" onClick={remove} />
      </Message>
    ) : (
      <Message my={2} bg={bg}>
        {message}
      </Message>
    ),
);

export default NotificationPanel;
