import React from 'react';
import { Box, Container } from 'rebass';
import Header from './Header';
import About from './About';
import Feature from './Feature';

const Landing = () => (
  <Box>
    <Header />

    <Container>
      <About />
      <Feature />
    </Container>
  </Box>
);

export default Landing;
