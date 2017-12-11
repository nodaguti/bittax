import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages from '../../i18n';

const mapStateToProps = (state) => ({
  locale: state.locale,
});

const LocaleProvider = ({ locale, children }) => {
  const appLocale = locale || window.navigator.language;

  return (
    <IntlProvider locale={appLocale} messages={messages[appLocale]}>
      {children}
    </IntlProvider>
  );
};

export default connect(mapStateToProps)(LocaleProvider);
