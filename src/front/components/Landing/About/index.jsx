import React from 'react';
import {
  Lead,
} from 'rebass';
import FormattedText from '../../FormattedText';
import messages from './messages';

const About = () => (
  <Lead
    py={4}
    f={[3, 4]}
    w={[1, null, '30em']}
  >
    <FormattedText {...messages.about} />
  </Lead>
);

export default About;
