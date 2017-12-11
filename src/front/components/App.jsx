import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import {
  Provider as ThemeProvider,
  Container,
} from 'rebass';
import LocaleProvider from '../containers/LocaleProvider';
import RouteChangedHandler from '../containers/RouteChangedHandler';
import Error from '../containers/Error';
import NotificationList from '../containers/NotificationList';
import Navbar from '../components/Navbar';
import Home from '../containers/Home';
import SourceList from '../containers/SourceList';
import SourceImporter from '../containers/SourceImporter';
import ApiIntegrator from '../containers/ApiIntegrator';
import OAuthRedirectHandler from '../containers/OAuthRedirectHandler';

const theme = {
  // https://qiita.com/RinoTsuka/items/4181efd43d072e246519
  font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Original Yu Gothic", "Yu Gothic", YuGothic, Verdana, Meiryo, "M+ 1p", sans-serif',
};

const App = () => (
  <LocaleProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Route component={RouteChangedHandler} />

          <Navbar />

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
    </ThemeProvider>
  </LocaleProvider>
);

export default App;
