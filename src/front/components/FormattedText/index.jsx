import React from 'react';
import { FormattedMessage } from 'react-intl';

const FormattedText = (props) => (
  <FormattedMessage {...props}>{(text) => text}</FormattedMessage>
);

export default FormattedText;
