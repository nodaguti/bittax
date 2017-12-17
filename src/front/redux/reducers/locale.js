import { SET_LOCALE } from '../actions';

const initialState = null;

const reducers = {
  [SET_LOCALE](state, localeToSet) {
    return localeToSet;
  },
};

export default function locale(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return reducer ? reducer(state, payload) : state;
}
