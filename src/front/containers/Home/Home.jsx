import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (<div>Home!</div>);
  }
}

export default connect()(Home);
