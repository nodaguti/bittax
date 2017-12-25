import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, onlyUpdateForKeys } from 'recompose';
import { Select } from 'rebass';
import messages from './messages';
import FormattedText from '../../components/FormattedText';
import i18nMessages from '../../i18n';
import { setLocale } from '../../redux/actions';

const LocaleSelector = compose(
  connect((state) => ({
    locale: state.locale,
  })),
  withProps((props) => ({
    locales: Object.keys(i18nMessages),
    appLocale: props.locale || window.navigator.language,
  })),
  withHandlers({
    onLocaleChange: (props) => (event) => {
      props.dispatch(setLocale(event.target.value));
    },
  }),
  onlyUpdateForKeys(['appLocale']),
)(({ locales, appLocale, onLocaleChange }) => (
  <Select value={appLocale} onChange={onLocaleChange}>
    {locales.map((l) => (
      <option key={l} value={l}>
        <FormattedText {...messages[l]} />
      </option>
    ))}
  </Select>
));

export default LocaleSelector;
