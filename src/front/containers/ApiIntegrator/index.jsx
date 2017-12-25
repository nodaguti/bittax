import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

const ApiIntegrator = compose(
  connect(),
  withProps((props) => ({
    provider: props.match.params.provider,
  })),
)(({ provider }) => <div>Please input the API key of {provider}</div>);

export default ApiIntegrator;
