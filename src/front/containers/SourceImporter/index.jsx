import React, { Component } from 'react';
import { connect } from 'react-redux';

class SourceImporter extends Component {
  render() {
    return <div>{this.props.provider}</div>;
  }
}

export default connect()(SourceImporter);
