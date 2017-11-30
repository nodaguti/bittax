import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import configureStore from './redux/stores';

render(
  <Root store={configureStore()} />,
  document.getElementById('root'),
);
