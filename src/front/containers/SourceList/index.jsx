import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Flex,
  Box,
  Panel,
  PanelHeader,
} from 'rebass';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import {
  BlockButton,
  BlockButtonOutline,
} from '../../components/BlockButton';
import { requestOAuthIntegration } from '../../redux/actions';
import providers from '../../providers';

const mapStateToProps = (state) => ({
  oauth: state.oauth,
});

class SourceList extends Component {
  renderOAuthButton(id) {
    const {
      oauth,
      dispatch,
    } = this.props;
    const isConnected = oauth.has(id);

    return isConnected ? (
      <BlockButton my={2}>
        <FormattedMessage {...messages.oAuthConnected} />
      </BlockButton>
    ) : (
      <BlockButtonOutline
        my={2}
        onClick={() => dispatch(requestOAuthIntegration({ provider: id }))}
      >
        <FormattedMessage {...messages.connectViaOAuth} />
      </BlockButtonOutline>
    );
  }

  renderAPIButton(id) {
    const {
      history,
    } = this.props;

    return (
      <BlockButtonOutline
        my={2}
        onClick={() => history.push(`/integrate/api/${id}`)}
      >
        <FormattedMessage {...messages.connectViaAPIKey} />
      </BlockButtonOutline>
    );
  }

  renderCSVButton(id) {
    const {
      history,
    } = this.props;

    return (
      <BlockButtonOutline
        my={2}
        onClick={() => history.push(`/sources/add/${id}`)}
      >
        <FormattedMessage {...messages.importFromCSV} />
      </BlockButtonOutline>
    );
  }

  renderPanel(provider) {
    const { id, name } = provider;

    return (
      <Box
        key={id}
        px={2}
        py={2}
        w={[
          1,
          1 / 2,
          1 / 3,
        ]}
      >
        <Panel color="blue">
          <PanelHeader color="white" bg="blue">
            {name}
          </PanelHeader>
          <Box p={2}>
            {
              !provider.oauth ? '' : this.renderOAuthButton(id)
            }
            {
              !provider.api ? '' : this.renderAPIButton(id)
            }
            {
              !provider.csv ? '' : this.renderCSVButton(id)
            }
          </Box>
        </Panel>
      </Box>
    );
  }

  render() {
    return (
      <Flex wrap>
        {providers.map((provider) => this.renderPanel(provider))}
      </Flex>
    );
  }
}

export default connect(mapStateToProps)(SourceList);
