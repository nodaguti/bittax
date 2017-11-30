import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Header from '../containers/Header';
import Container from '../components/Container';
import Home from '../containers/Home';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Header />

      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Container>
    </Router>
  </Provider>
);

export default Root;
