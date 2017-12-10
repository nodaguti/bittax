import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import RouteChangedHandler from '../containers/RouteChangedHandler';
import Error from '../containers/Error';
import NotificationList from '../containers/NotificationList';
import Header from '../components/Header';
import Container from '../components/Container';
import Home from '../containers/Home';
import SourceList from '../containers/SourceList';
import SourceImporter from '../containers/SourceImporter';
import ApiIntegrator from '../containers/ApiIntegrator';
import OAuthRedirectHandler from '../containers/OAuthRedirectHandler';

const App = () => (
  <Router>
    <div>
      <Route component={RouteChangedHandler} />

      <Header />

      <Container>
        <Error />
        <NotificationList />

        <Switch>
          <Route
            path="/"
            exact
            strict
            component={Home}
          />
          <Route
            path="/sources"
            exact
            strict
            component={SourceList}
          />
          <Route
            path="/sources/add/:provider"
            exact
            strict
            component={SourceImporter}
          />
          <Route
            path="/integrate/api/:provider"
            exact
            strict
            component={ApiIntegrator}
          />
          <Route
            path="/oauth/:provider"
            component={OAuthRedirectHandler}
          />
        </Switch>
      </Container>
    </div>
  </Router>
);

export default App;
