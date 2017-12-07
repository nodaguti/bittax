import { Map } from 'immutable';
import { OAUTH_TOKEN_FETCHED } from '../actions';
import { OAuthToken } from '../records';

const initialState = new Map();

const reducers = {
  [OAUTH_TOKEN_FETCHED](
    state,
    {
      provider,
      token,
      refreshToken,
      expire,
    },
  ) {
    return state.set(provider, new OAuthToken({
      provider,
      token,
      refreshToken,
      expire,
    }));
  },
};

export default function oauth(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
