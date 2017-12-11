import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Panel,
  Box,
} from 'rebass';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import {
  oAuthPopupRedirected,
  emitError,
} from '../../redux/actions';

class OAuthRedirectHandler extends Component {
  componentDidMount() {
    const { match, dispatch } = this.props;
    const { provider } = match.params;
    const { formatMessage } = this.context.intl;

    try {
      const queries = new URLSearchParams(window.location.search);
      const code = queries.get('code');
      const state = queries.get('state');

      dispatch(oAuthPopupRedirected({ code, state, provider }));
    } catch (ex) {
      dispatch(emitError({
        name: formatMessage(messages.authenticationError),
        message: formatMessage(messages.authenticationErrorMessage, { provider }),
        details: ex,
      }));
    }
  }

  render() {
    return (
      <Panel color="blue">
        <Box p={2}>
          <FormattedMessage {...messages.saving} />
        </Box>
      </Panel>
    );
  }
}

export default connect()(OAuthRedirectHandler);
