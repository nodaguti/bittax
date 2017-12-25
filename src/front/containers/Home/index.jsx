import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isTransactionsEmpty } from '../../selectors/transactionSelectors';

const mapStateToProps = (state) => ({
  isEmpty: isTransactionsEmpty(state),
});

const Home = ({ isEmpty }) =>
  isEmpty ? <Redirect to="/landing" /> : <Redirect to="/dashboard" />;

export default connect(mapStateToProps)(Home);
