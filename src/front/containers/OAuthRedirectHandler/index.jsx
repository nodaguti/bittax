import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  getContext,
  onlyUpdateForKeys,
  lifecycle,
} from 'recompose';
import { Panel, Box, Text } from 'rebass';
import { intlShape } from 'react-intl';
import messages from './messages';
import FormattedText from '../../components/FormattedText';
import { oAuthPopupRedirected, emitError } from '../../redux/actions';
import { getProviderName } from '../../providers';

const OAuthRedirectHandler = compose(
  connect((state) => ({
    locale: state.locale,
  })),
  withProps((props) => ({
    provider: props.match.params.provider,
  })),
  getContext({
    intl: intlShape,
  }),
  lifecycle({
    componentDidMount() {
      const { provider, dispatch, intl } = this.props;
      const { formatMessage } = intl;
      const providerName = getProviderName(provider);

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
    },
  }),
  onlyUpdateForKeys(['locale']),
)(() => (
  <Panel color="blue">
    <Box p={2}>
      <Text>
        <FormattedText {...messages.saving} />
      </Text>
    </Box>
  </Panel>
));

export default OAuthRedirectHandler;
