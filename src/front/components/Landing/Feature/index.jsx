import React from 'react';
import { Flex, Lead, Text } from 'rebass';
import MdSecurity from 'react-icons/lib/md/security';
import MdTimelapse from 'react-icons/lib/md/timelapse';
import MdSmartphone from 'react-icons/lib/md/smartphone';
import Section from '../Section';
import Column from '../Column';
import FormattedText from '../../FormattedText';
import messages from './messages';

const Feature = () => (
  <Section name="Features">
    <Flex wrap>
      <Column>
        <Lead center f={6}>
          <MdSecurity />
        </Lead>
        <Lead center bold f={3} my={3}>
          <FormattedText {...messages.secure} />
        </Lead>
        <Text>
          <FormattedText {...messages.secureDescription} />
        </Text>
      </Column>
      <Column>
        <Lead center f={6}>
          <MdTimelapse />
        </Lead>
        <Lead center bold f={3} my={3}>
          <FormattedText {...messages.realtime} />
        </Lead>
        <Text>
          <FormattedText {...messages.realtimeDescription} />
        </Text>
      </Column>
      <Column>
        <Lead center f={6}>
          <MdSmartphone />
        </Lead>
        <Lead center bold f={3} my={3}>
          <FormattedText {...messages.ubiquitous} />
        </Lead>
        <Text>
          <FormattedText {...messages.ubiquitousDescription} />
        </Text>
      </Column>
    </Flex>
  </Section>
);

export default Feature;
