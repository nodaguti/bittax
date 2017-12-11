import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Border,
  Text,
  Progress,
} from 'rebass';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const renderActivity = (progress) => {
  const {
    id,
    title,
    description,
    total,
    done,
  } = progress;

  return (
    <Border key={id} p={3} bottom>
      <Text><strong>{title}</strong>: {done}/{total}</Text>
      <Text mb={2}>{description}</Text>
      {
        total > 0 ? (
          <Progress value={done / total} />
        ) : (
          <Progress value={0} />
        )
      }
    </Border>
  );
};

const SizedBox = styled(Box)`
  max-width: 95vw;
  min-width: 15vw;
`;

const ActivityList = ({ activities }) => (
  <SizedBox>
    {
      activities.size === 0 ? (
        <Text
          center
          color="gray"
          p={3}
        >
          <FormattedMessage {...messages.noTasks} />
        </Text>
      ) : (
        activities.map((activity) => renderActivity(activity)).valueSeq().toArray()
      )
    }
  </SizedBox>
);

export default ActivityList;
