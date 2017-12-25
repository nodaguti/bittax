import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

const SourceImporter = compose(
  connect(),
  withProps((props) => ({
    provider: props.match.params.provider,
  })),
)(({ provider }) => (
  <div>Please drag & drop the CSV files obtained from {provider}.</div>
));

export default SourceImporter;
