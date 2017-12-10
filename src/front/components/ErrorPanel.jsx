import React from 'react';
import {
  Message,
  Pre,
  Box,
} from 'rebass';

const ErrorPanel = ({ name, message, details }) => {
  if (process.env.NODE_ENV === 'development' && details) {
    return (
      <Message bg="red" my={2}>
        <Box>
          <div>{name}: {message}</div>
          <div>{details.name}: {details.message}</div>
          <Pre>{details.stack}</Pre>
        </Box>
      </Message>
    );
  }

  return (
    <Message bg="red">
      {name}: {message}
    </Message>
  );
};

export default ErrorPanel;
