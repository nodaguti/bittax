import React from 'react';
import { Box, Heading, BlockLink } from 'rebass';

const Section = ({ name, children }) => (
  <Box my={4}>
    <Heading pb={3}>
      <BlockLink href={`#sec-${encodeURIComponent(name.toLowerCase())}`}>
        {name}
      </BlockLink>
    </Heading>
    {children}
  </Box>
);

export default Section;
