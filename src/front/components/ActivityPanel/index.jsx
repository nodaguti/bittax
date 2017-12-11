import React from 'react';
import { Panel } from 'rebass';
import ActivityList from '../ActivityList';

const ActivityPanel = ({ activities, ...props }) => (
  <Panel color="black" bg="white" {...props}>
    <ActivityList activities={activities} />
  </Panel>
);

export default ActivityPanel;
