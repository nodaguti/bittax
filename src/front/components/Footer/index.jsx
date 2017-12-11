import React from 'react';
import {
  Box,
  Toolbar,
  Text,
  NavLink,
  Link,
} from 'rebass';
import Hide from 'hidden-styled';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import LocaleSelector from '../../containers/LocaleSelector';

const Footer = () => (
  <Box f={1}>
    <Toolbar>
      <LinkContainer to="/landing">
        <NavLink>About</NavLink>
      </LinkContainer>
      <LinkContainer to="/terms">
        <NavLink>Terms</NavLink>
      </LinkContainer>
      <LinkContainer to="/privacy">
        <NavLink>Privacy</NavLink>
      </LinkContainer>
      <Box ml="auto" f={2} color="black" bg="white">
        <LocaleSelector />
      </Box>
    </Toolbar>
    <Toolbar>
      <Box p={2} color="gray" f={12}>
        <Text>
          <FormattedMessage
            {...messages.opensource}
            values={{
              linkToGithub: (
                <Link
                  href="https://github.com/nodaguti/bittax"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray"
                >
                  Github
                </Link>
              ),
            }}
          />
        </Text>
        <Text mt={3}><FormattedMessage {...messages.disclaimer} /></Text>
        <Text mt={3}>Bittax &copy; 2017 nodaguti.</Text>
      </Box>
    </Toolbar>
  </Box>
);

export default Footer;
