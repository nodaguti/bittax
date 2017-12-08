import React, { Component } from 'react';
import { connect } from 'react-redux';
import { chunk } from 'lodash-es';
import {
  Grid,
  Row,
  Col,
  Panel,
  Button,
} from 'react-bootstrap';
import { requestOAuthIntegration } from '../redux/actions';
import providers from '../providers';

const mapStateToProps = (state) => ({
  oauth: state.oauth,
});

class SourceListToAdd extends Component {
  renderOAuthButton(id) {
    const {
      oauth,
      dispatch,
    } = this.props;
    const isConnected = oauth.has(id);

    return isConnected ? (
      <Button block bsStyle="info">
        OAuth 連携済
      </Button>
    ) : (
      <Button
        block
        onClick={() => dispatch(requestOAuthIntegration({ provider: id }))}
      >
        OAuth 認証で連携
      </Button>
    );
  }

  renderAPIButton(id) {
    const {
      history,
    } = this.props;

    return (
      <Button
        block
        onClick={() => history.push(`/integrate/api/${id}`)}
      >
        API Key を入力して連携
      </Button>
    );
  }

  renderCSVButton(id) {
    const {
      history,
    } = this.props;

    return (
      <Button
        block
        onClick={() => history.push(`/source/add/${id}`)}
      >
        CSV ファイルからデータ読み込み
      </Button>
    );
  }

  renderPanel(provider) {
    const { id, name } = provider;

    return (
      <Panel header={name} bsStyle="info">
        {
          !provider.oauth ? '' : this.renderOAuthButton(id)
        }
        {
          !provider.api ? '' : this.renderAPIButton(id)
        }
        {
          !provider.csv ? '' : this.renderCSVButton(id)
        }
      </Panel>
    );
  }

  renderRow({ providersChunk, chunkId }) {
    return (
      <Row key={chunkId}>
        {
          providersChunk.map((provider) => {
            const { id } = provider;

            return (
              <Col xs={6} md={4} key={id}>
                {this.renderPanel(provider)}
              </Col>
            );
          })
        }
      </Row>
    );
  }

  render() {
    return (
      <Grid>
        {
          chunk(providers, 3)
            .map((providersChunk, idx) => this.renderRow({ providersChunk, chunkId: idx }))
        }
      </Grid>
    );
  }
}

export default connect(mapStateToProps)(SourceListToAdd);
