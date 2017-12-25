import React from 'react';
import { compose, onlyUpdateForKeys, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Flex, Box, Panel, PanelHeader } from 'rebass';
import messages from './messages';
import FormattedText from '../../components/FormattedText';
import { BlockButton, BlockButtonOutline } from '../../components/BlockButton';
import { requestOAuthIntegration } from '../../redux/actions';
import providers from '../../providers';

const OAuthButton = compose(
  connect((state, props) => ({
    isConnected: state.oauth.has(props.id),
    locale: state.locale,
  })),
  withHandlers({
    onClick: (props) => () => {
      const { dispatch, id } = props;
      dispatch(requestOAuthIntegration({ provider: id }));
    },
  }),
  onlyUpdateForKeys(['id', 'isConnected', 'locale']),
)(
  ({ isConnected, onClick }) =>
    isConnected ? (
      <BlockButton my={2}>
        <FormattedText {...messages.oAuthConnected} />
      </BlockButton>
    ) : (
      <BlockButtonOutline my={2} onClick={onClick}>
        <FormattedText {...messages.connectViaOAuth} />
      </BlockButtonOutline>
    ),
);

const APIButton = compose(
  withRouter,
  withHandlers({
    onClick: (props) => () => {
      const { history, id } = props;
      history.push(`/integrate/api/${id}`);
    },
  }),
  onlyUpdateForKeys(['id']),
)(({ onClick }) => (
  <BlockButtonOutline my={2} onClick={onClick}>
    <FormattedText {...messages.connectViaAPIKey} />
  </BlockButtonOutline>
));

const CSVButton = compose(
  withRouter,
  withHandlers({
    onClick: (props) => () => {
      const { history, id } = props;
      history.push(`/sources/add/${id}`);
    },
  }),
  onlyUpdateForKeys(['id']),
)(({ onClick }) => (
  <BlockButtonOutline my={2} onClick={onClick}>
    <FormattedText {...messages.importFromCSV} />
  </BlockButtonOutline>
));

const ProviderPanel = ({ provider }) => {
  const { id, name, oauth, api, csv } = provider;

  return (
    <Box px={2} py={2} w={[1, 1 / 2, 1 / 3]}>
      <Panel color="blue">
        <PanelHeader color="white" bg="blue">
          {name}
        </PanelHeader>
        <Box p={2}>
          {!oauth ? '' : <OAuthButton id={id} />}
          {!api ? '' : <APIButton id={id} />}
          {!csv ? '' : <CSVButton id={id} />}
        </Box>
      </Panel>
    </Box>
  );
};

const SourceList = () => (
  <Container py={3}>
    <Flex wrap>
      {providers
        .map((provider) => (
          <ProviderPanel key={provider.id} provider={provider} />
        ))
        .valueSeq()
        .toArray()}
    </Flex>
  </Container>
);

export default SourceList;
