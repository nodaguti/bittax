import React from 'react';
import {
  Box,
} from 'rebass';

const Column = ({ children }) => (
  <Box
    px={[2, 3]}
    py={2}
    w={[
      1,
      1 / 2,
      1 / 3,
    ]}
  >
    {children}
  </Box>
);

export default Column;
