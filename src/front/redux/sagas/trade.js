import { fork, put, call, takeEvery } from 'redux-saga/effects';
import {
  FETCH_TRADES_OF_ALL_PAIRS,
  transactionsFetched,
  emitError,
} from '../actions';
import APIs from '../../api';

function* callTradesOfAllPairs({ payload: { provider, since = 0 } }) {
  const api = APIs[provider];

  try {
    const results = yield call([api.private, 'fetchTradesOfAllPairs'], { provider, since });
    yield put(transactionsFetched({ provider, transactionsMap: results }));
  } catch (ex) {
    yield put(emitError({
      name: '通信エラー',
      message: `${provider} から情報を取得している際にエラーが発生しました．`,
      details: ex,
    }));
  }
}

function* tradesOfAllPairs() {
  yield takeEvery(FETCH_TRADES_OF_ALL_PAIRS, callTradesOfAllPairs);
}

export default function* tradeSaga() {
  yield fork(tradesOfAllPairs);
}
