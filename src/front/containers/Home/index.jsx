import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state) => ({
  transaction: state.transaction,
});

const Home = ({ transaction }) => {
  const hasTransaction = !transaction.isEmpty();

  return hasTransaction ? (
    <Redirect to="/dashboard" />
  ) : (
    <Redirect to="/landing" />
  );
};

export default connect(mapStateToProps)(Home);
