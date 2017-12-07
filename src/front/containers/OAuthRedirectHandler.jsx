import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Alert } from 'react-bootstrap';
import { oAuthPopupRedirected } from '../redux/actions';

const mapStateToProps = (state) => ({
  error: state.error,
});

class OAuthRedirectHandler extends Component {
  renderError = ({ name, message, details }) => {
    if (process.env.NODE_ENV === 'development' && details) {
      return (
        <Alert bsStyle="danger">
          <h4>{name}</h4>
          <p>{message}</p>
          <p>
            <Panel header="Error Details">
              <thead>
                <tr><td>Prop</td><td>Value</td></tr>
              </thead>
              <tbody>
                <tr><td>name</td><td>{details.name}</td></tr>
                <tr><td>message</td><td>{details.message}</td></tr>
                <tr><td>stack</td><td><pre>{details.stack}</pre></td></tr>
              </tbody>
            </Panel>
          </p>
        </Alert>
      );
    }

    return (
      <Alert bsStyle="danger">
        <h4>{name}</h4>
        <p>{message}</p>
      </Alert>
    );
  }

  render() {
    const { error, match, dispatch } = this.props;

    if (error) {
      return this.renderError(error);
    }

    try {
      const queries = new URLSearchParams(window.location.search);
      const code = queries.get('code');
      const state = queries.get('state');
      const { provider } = match.params;

      dispatch(oAuthPopupRedirected({ code, state, provider }));

      return (
        <Panel>
          認証情報を保存して、操作していたウィンドウに戻る処理を行っています...
        </Panel>
      );
    } catch (ex) {
      return this.renderError({
        name: '認証エラー',
        message: '認証情報の受信に失敗しました．もう一度認証をやり直してください．',
        details: ex,
      });
    }
  }
}

export default connect(mapStateToProps)(OAuthRedirectHandler);
