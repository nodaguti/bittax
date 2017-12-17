import {
  SET_STRATEGY,
  SET_REPORT_CURRENCY,
  MAKE_REPORT,
  COMPLETED_MAKING_REPORT,
} from '../actions';
import { Report } from '../../records';

const initialState = new Report();

const reducers = {
  [SET_STRATEGY](state, strategy) {
    return state.set('strategy', strategy);
  },

  [SET_REPORT_CURRENCY](state, reportCurrency) {
    return state.set('reportCurrency', reportCurrency);
  },

  [MAKE_REPORT](state) {
    return state.set('processing', true);
  },

  [COMPLETED_MAKING_REPORT](state, reports) {
    return state.withMutations((mutableState) => {
      mutableState.set('processing', false);
      reports.forEach((report, type) => mutableState.set(type, report));
    });
  },
};

export default function reportReducer(state = initialState, { type, payload }) {
  const reducer = reducers[type];
  return (reducer) ? reducer(state, payload) : state;
}
