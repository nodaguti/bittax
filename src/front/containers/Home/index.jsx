import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
});

const Home = ({ transactions }) => {
  const hasTransaction = !transactions.coins.isEmpty();

  return hasTransaction ? (
    <Redirect to="/dashboard" />
  ) : (
    <Redirect to="/landing" />
  );
};

export default connect(mapStateToProps)(Home);
