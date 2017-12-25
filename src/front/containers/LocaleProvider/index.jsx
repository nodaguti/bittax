import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { IntlProvider } from 'react-intl';
import messages from '../../i18n';

const LocaleProvider = compose(
  connect((state) => ({
    locale: state.locale,
  })),
  withProps((props) => ({
    appLocale: props.locale || window.navigator.language,
  })),
)(({ appLocale, children }) => (
  <IntlProvider locale={appLocale} messages={messages[appLocale]}>
    {children}
  </IntlProvider>
));

export default LocaleProvider;
