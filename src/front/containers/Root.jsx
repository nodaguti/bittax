import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import RouteChangedHandler from '../containers/RouteChangedHandler';
import Error from '../containers/Error';
import Header from '../containers/Header';
import Container from '../components/Container';
import Home from '../containers/Home';
import SourceListToAdd from '../containers/SourceListToAdd';
import SourceImporter from '../containers/SourceImporter';
import ApiIntegrator from '../containers/ApiIntegrator';
import OAuthRedirectHandler from '../containers/OAuthRedirectHandler';

const Root = ({ persistor, store }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <div>
          <Route component={RouteChangedHandler} />

          <Header />

          <Container>
            <Error />

            <Switch>
              <Route
                path="/"
                exact
                strict
                component={Home}
              />
              <Route
                path="/source/add"
                exact
                strict
                component={SourceListToAdd}
              />
              <Route
                path="/source/add/:provider"
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
    </PersistGate>
  </Provider>
);

export default Root;
