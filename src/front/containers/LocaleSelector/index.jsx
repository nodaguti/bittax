import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'rebass';
import messages from './messages';
import FormattedText from '../../components/FormattedText';
import i18nMessages from '../../i18n';
import { setLocale } from '../../redux/actions';

const locales = Object.keys(i18nMessages);

const mapStateToProps = (state) => ({
  locale: state.locale,
});

const LocaleSelector = ({ locale, dispatch }) => {
  const appLocale = locale || window.navigator.language;
  const onLocaleChanged = (newLocale) => dispatch(setLocale(newLocale));

  return (
    <Select
      value={appLocale}
      onChange={(ev) => onLocaleChanged(ev.target.value)}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          <FormattedText {...messages[l]} />
        </option>
      ))}
    </Select>
  );
};

export default connect(mapStateToProps)(LocaleSelector);
