import { take, fork, select } from 'redux-saga/effects';
import { IntlProvider } from 'react-intl';
import {
  REHYDRATION_COMPLETED,
  SET_LOCALE,
} from '../actions';
import messages from '../../i18n';

class IntlProviderManager {
  locale = '';

  cachedIntl = null;

  constructor(locale) {
    this.locale = locale;
  }

  set locale(locale) {
    const provider = new IntlProvider({ locale, messages });
    this.cachedIntl = provider.getChildContext().intl;
  }

  setLocale(locale) {
    this.locale = locale;
  }

  getIntl() {
    return this.cachedIntl;
  }
}

const manager = new IntlProviderManager(window.navigator.language);

function* handleRehydration() {
  while (true) {
    yield take(REHYDRATION_COMPLETED);
    const locale = yield select((state) => state.locale);

    if (locale) {
      manager.setLocale(locale);
    }
  }
}

function* handleLocaleUpdate() {
  while (true) {
    const { payload: locale } = yield take(SET_LOCALE);
    manager.setLocale(locale);
  }
}

export function intl() {
  return manager.getIntl();
}

export default function* i18nSaga() {
  yield fork(handleRehydration);
  yield fork(handleLocaleUpdate);
}
