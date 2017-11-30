import React from 'react';
import { connect } from 'react-redux';

const Home = () => {
  return (
    <div>
      Home!
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

