import { connect } from 'react-redux';
import { compose, withPropsOnChange, onlyUpdateForKeys } from 'recompose';
import { routeChanged } from '../../redux/actions';

const RouteChangedHandler = compose(
  connect(),
  withPropsOnChange(['location', 'dispatch'], ({ location, dispatch }) => {
    dispatch(routeChanged({ location }));
  }),
  onlyUpdateForKeys(['location']),
)(() => null);

export default RouteChangedHandler;
