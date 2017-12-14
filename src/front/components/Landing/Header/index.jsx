import React from 'react';
import styled from 'styled-components';
import {
  Banner,
  Flex,
  Heading,
  Lead,
  ButtonOutline,
  Link,
} from 'rebass';
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FormattedText from '../../FormattedText';
import messages from './messages';

const photo = 'https://images.unsplash.com/photo-1500316124030-4cffa46f10f0?auto=format&fit=crop&w=1950&q=80';

const Btn = styled(ButtonOutline)`
  display: inline-block;
  color: white;
  background-color: transparent;

  &:hover {
    color: black;
    background-color: white;
  }
`;

const Header = () => (
  <Banner
    py={[4, 5, 6]}
    color="white"
    bg="gray7"
    backgroundImage={photo}
  >
    <Flex
      wrap
      align="center"
    >
      <Heading
        is="h1"
        w={[1, 1, 320]}
        f={[6, 7, 8]}
        align="center"
      >
        Bittax
      </Heading>
      <Lead w={[1, 1, 320]}>
        <FormattedText {...messages.lead} />
      </Lead>
    </Flex>
    <Flex wrap py={5} my={5} align="center" column>
      <Btn
        is={RouterLink}
        to="/dashboard"
        f={3}
        mx={3}
        py={3}
      >
        <FormattedText {...messages.startBtn} />
      </Btn>
      <Lead
        f={1}
        mx={3}
        py={2}
        w={[1, 270]}
        color="gray"
      >
        <FormattedMessage
          {...messages.agreeToTerms}
          values={{
            linkToTerms: (
              <Link
                is={RouterLink}
                to="/terms"
                href="/terms"
                color="gray"
              >
                <FormattedText {...messages.terms} />
              </Link>
            ),
            linkToPrivacy: (
              <Link
                is={RouterLink}
                to="/privacy"
                href="/privacy"
                color="gray"
              >
                <FormattedText {...messages.privacyPolicy} />
              </Link>
            ),
          }}
        />
      </Lead>
    </Flex>
  </Banner>
);

export default Header;
