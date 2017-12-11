import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import jaLocaleData from 'react-intl/locale-data/ja';

import enMessages from './locales/en.json';
import jaMessages from './locales/ja.json';

addLocaleData([
  ...enLocaleData,
  ...jaLocaleData,
]);

const messages = {
  en: enMessages,
  ja: jaMessages,
};

export default messages;
