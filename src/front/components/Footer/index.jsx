import React from 'react';
import { Box, Toolbar, Text, NavLink, Link } from 'rebass';
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FormattedText from '../FormattedText';
import messages from './messages';
import LocaleSelector from '../../containers/LocaleSelector';

const Footer = () => (
  <Box f={1}>
    <Toolbar>
      <NavLink is={RouterLink} to="/landing" href="/landing">
        About
      </NavLink>
      <NavLink is={RouterLink} to="/terms" href="/terms">
        Terms
      </NavLink>
      <NavLink is={RouterLink} to="/privacy" href="/privacy">
        Privacy
      </NavLink>
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
        <Text mt={3}>
          <FormattedText {...messages.disclaimer} />
        </Text>
        <Text mt={3}>Bittax &copy; 2017 nodaguti.</Text>
      </Box>
    </Toolbar>
  </Box>
);

export default Footer;
