import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import configureStore from './redux/store';

const { persistor, store } = configureStore();

render(
  <Root store={store} persistor={persistor} />,
  document.getElementById('root'),
);
