import React from 'react';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';
import { Box, Border, Text, Progress } from 'rebass';
import FormattedText from '../FormattedText';
import messages from './messages';

const Activity = onlyUpdateForKeys(['activity'])(({ activity }) => {
  const { title, description, total, done } = activity;

  return (
    <Border p={3} bottom>
      <Text>
        <strong>{title}</strong>: {done}/{total}
      </Text>
      <Text mb={2}>{description}</Text>
      {total > 0 ? <Progress value={done / total} /> : <Progress value={0} />}
    </Border>
  );
});

const SizedBox = styled(Box)`
  max-width: 95vw;
  min-width: 15vw;
`;

const ActivityList = compose(
  withProps((props) => ({
    empty: props.activities.size === 0,
  })),
  onlyUpdateForKeys(['activities', 'empty']),
)(({ empty, activities }) => (
  <SizedBox>
    {empty ? (
      <Text center color="gray" p={3}>
        <FormattedText {...messages.noTasks} />
      </Text>
    ) : (
      activities
        .map((activity) => <Activity key={activity.id} activity={activity} />)
        .valueSeq()
        .toArray()
    )}
  </SizedBox>
));

export default ActivityList;
