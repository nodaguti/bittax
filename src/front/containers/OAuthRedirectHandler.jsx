import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import {
  oAuthPopupRedirected,
  emitError,
} from '../redux/actions';

class OAuthRedirectHandler extends Component {
  componentDidMount() {
    const { match, dispatch } = this.props;

    try {
      const queries = new URLSearchParams(window.location.search);
      const code = queries.get('code');
      const state = queries.get('state');
      const { provider } = match.params;

      dispatch(oAuthPopupRedirected({ code, state, provider }));
    } catch (ex) {
      dispatch(emitError({
        name: '認証エラー',
        message: '認証情報の受信に失敗しました．もう一度認証をやり直してください．',
        details: ex,
      }));
    }
  }

  render() {
    return (
      <Panel>
        認証情報を保存して、操作していたウィンドウに戻る処理を行っています...
      </Panel>
    );
  }
}

export default connect()(OAuthRedirectHandler);
