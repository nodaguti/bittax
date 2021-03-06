import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import styled from 'styled-components';
import { Provider as ThemeProvider, Container, Flex, Box } from 'rebass';
import LocaleProvider from '../../containers/LocaleProvider';
import Navbar from '../Navbar';
import RouteChangedHandler from '../../containers/RouteChangedHandler';
import Home from '../../containers/Home';
import Landing from '../Landing';
import Error from '../../containers/Error';
import NotificationList from '../../containers/NotificationList';
import Dashboard from '../../containers/Dashboard';
import SourceList from '../../containers/SourceList';
import SourceImporter from '../../containers/SourceImporter';
import ApiIntegrator from '../../containers/ApiIntegrator';
import OAuthRedirectHandler from '../../containers/OAuthRedirectHandler';
import Footer from '../Footer';

const theme = {
  // https://qiita.com/RinoTsuka/items/4181efd43d072e246519
  font:
    '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Original Yu Gothic", "Yu Gothic", YuGothic, Verdana, Meiryo, "M+ 1p", sans-serif',
};

const FlexFullscreened = styled(Flex)`
  height: 100vh;
`;

const App = () => (
  <LocaleProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <FlexFullscreened column>
          <Route component={RouteChangedHandler} />
          <Box flex="0 0 auto">
            <Navbar />
          </Box>
          <Box flex="1 0 auto">
            <Switch>
              <Route path="/" exact strict component={Home} />
              <Route path="/landing" exact strict component={Landing} />
              <Route>
                <Box>
                  <Container>
                    <Error />
                    <NotificationList />
                  </Container>
                  <Switch>
                    <Redirect
                      from="/dashboard"
                      exact
                      strict
                      to="/dashboard/all"
                    />
                    <Route
                      path="/dashboard/:type"
                      exact
                      component={Dashboard}
                    />
                    <Route
                      path="/dashboard/:type/:filter"
                      exact
                      component={Dashboard}
                    />
                    <Route path="/sources" exact strict render={SourceList} />
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
                </Box>
              </Route>
            </Switch>
          </Box>
          <Box flex="0 0 auto">
            <Footer />
          </Box>
        </FlexFullscreened>
      </Router>
    </ThemeProvider>
  </LocaleProvider>
);

export default App;
