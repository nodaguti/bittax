import React from 'react';
import { connect } from 'react-redux';
import ErrorPanel from '../../components/ErrorPanel';

const mapStateToProps = (state) => ({
  error: state.error,
});

const Error = ({ error }) => {
  if (!error) {
    return '';
  }

  const { name, message, details } = error;
  return <ErrorPanel {...{ name, message, details }} />;
};

export default connect(mapStateToProps)(Error);
