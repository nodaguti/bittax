import React, { Component } from 'react';
import { connect } from 'react-redux';

class ApiIntegrator extends Component {
  render() {
    return <div>Please input the API key of {this.props.provider}</div>;
  }
}

export default connect()(ApiIntegrator);
