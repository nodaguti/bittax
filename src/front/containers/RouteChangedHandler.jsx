import { Component } from 'react';
import { connect } from 'react-redux';
import { routeChanged } from '../redux/actions';

class RouteChangedHandler extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.props.dispatch(routeChanged({ location: nextProps.location }));
    }
  }

  render() {
    return null;
  }
}

export default connect()(RouteChangedHandler);
