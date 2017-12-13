import uuidv4 from 'uuid/v4';
import fetch from './fetch';

const CLIENT_ID = '08b30c2a9afb48d6be42a511f9186cc3';
const CLIENT_SECRET = 'c7a70886878c4aa0bbd7afa815de35bc';

export default class OAuth {
  static openAuthWindow() {
    const url = 'https://zaif.jp/oauth';
    const state = uuidv4();
    const params = {
      client_id: CLIENT_ID,
      response_type: 'code',
      scope: 'info',
      state,
      redirect_uri: `${window.location.origin}/oauth/zaif`,
    };
    const searchParams = new URLSearchParams(params);
    const authWin = window.open(`${url}?${searchParams.toString()}`);

    return { state, authWin };
  }

  static async fetchToken({ code }) {
    const data = await fetch('https://oauth.zaif.jp/v1/token', {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: `${window.location.origin}/oauth/zaif`,
      },
    });

    return {
      state: data.state,
      token: data.access_token,
      refreshToken: data.refresh_token,
      expire: Date.now() + (Number(data.expires_in) * 1000),
    };
  }

  static async refreshToken({ refreshToken }) {
    const data = await fetch('https://oauth.zaif.jp/v1/refresh_token', {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    return {
      token: data.access_token,
      refreshToken: data.refresh_token,
      expire: Date.now() + (Number(data.expires_in) * 1000),
    };
  }
}
