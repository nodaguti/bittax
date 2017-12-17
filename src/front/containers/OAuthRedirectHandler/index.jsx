import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Box, Text } from 'rebass';
import { intlShape } from 'react-intl';
import messages from './messages';
import FormattedText from '../../components/FormattedText';
import { oAuthPopupRedirected, emitError } from '../../redux/actions';
import { getProviderName } from '../../providers';

class OAuthRedirectHandler extends Component {
  // Allow the component to reference `context`.
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { provider } = match.params;
    const providerName = getProviderName(provider);
    const { formatMessage } = this.context.intl;

    try {
      const queries = new URLSearchParams(window.location.search);
      const code = queries.get('code');
      const state = queries.get('state');

      dispatch(oAuthPopupRedirected({ code, state, provider }));
    } catch (ex) {
      dispatch(
        emitError({
          name: formatMessage(messages.authenticationError),
          message: formatMessage(messages.authenticationErrorMessage, {
            provider: providerName,
          }),
          details: ex,
        }),
      );
    }
  }

  render() {
    return (
      <Panel color="blue">
        <Box p={2}>
          <Text>
            <FormattedText {...messages.saving} />
          </Text>
        </Box>
      </Panel>
    );
  }
}

export default connect()(OAuthRedirectHandler);
