import React from 'react';
import { connect } from 'react-redux';
import {
  ListGroup,
  ListGroupItem,
  ProgressBar,
} from 'react-bootstrap';

const mapStateToProps = (state) => ({
  activities: state.activities,
});

const renderActivity = (progress) => {
  const {
    id,
    title,
    description,
    total,
    done,
  } = progress;

  return (
    <ListGroupItem key={id}>
      <div>
        <strong>{title}</strong> {description}
        {
          total > 0 ? (
            <ProgressBar max={total} now={done} label={`${done}/${total}`} srOnly />
          ) : (
            <ProgressBar active now={100} srOnly />
          )
        }
      </div>
    </ListGroupItem>
  );
};

const ActivityList = ({ activities }) => (
  <ListGroup>
    {activities.map((activity) => renderActivity(activity)).valueSeq().toArray()}
  </ListGroup>
);

export default connect(mapStateToProps)(ActivityList);
