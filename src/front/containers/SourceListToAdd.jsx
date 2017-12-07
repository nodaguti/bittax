import React, { Component } from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash.chunk';
import {
  Grid,
  Row,
  Col,
  Panel,
  Button,
} from 'react-bootstrap';
import { requestOAuthIntegration } from '../redux/actions';
import providers from '../providers';

const mapStateToProps = () => ({});

class SourceListToAdd extends Component {
  renderRow = ({ providersChunk, chunkId }) => {
    const { history, dispatch } = this.props;

    return (
      <Row key={chunkId}>
        {
          providersChunk.map((provider) => {
            const { id, name } = provider;

            return (
              <Col xs={6} md={4} key={id}>
                <Panel header={name} bsStyle="info">
                  {
                    !provider.oauth ? '' : (
                      <Button
                        onClick={
                          () => dispatch(requestOAuthIntegration({ provider: id }))
                        }
                      >
                        OAuth 認証で連携
                      </Button>
                    )
                  }
                  {
                    !provider.api ? '' : (
                      <Button
                        onClick={
                          () => history.push(`/integrate/api/${id}`)
                        }
                      >
                        API Key を入力して連携
                      </Button>
                    )
                  }
                  {
                    !provider.csv ? '' : (
                      <Button
                        onClick={
                          () => history.push(`/source/add/${id}`)
                        }
                      >
                        CSV ファイルからデータ読み込み
                      </Button>
                    )
                  }
                </Panel>
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
