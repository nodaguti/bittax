import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withState,
  withProps,
  withHandlers,
  onlyUpdateForKeys,
} from 'recompose';
import { Manager, Target, Popper } from 'react-popper';
import { Fixed } from 'rebass';
import styled, { keyframes } from 'styled-components';
import MdDataUsage from 'react-icons/lib/md/data-usage';
import ActivityPanel from '../../components/ActivityPanel';
import ToolbarIcon from '../../components/ToolbarIcon';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotatingIcon = styled(ToolbarIcon)`
  animation: ${rotate} 2s linear infinite;
`;

const ActivityPanelPopover = compose(
  connect((state) => ({
    activities: state.activities,
    locale: state.locale,
  })),
  withProps((props) => ({
    inProgress: props.activities.size !== 0,
  })),
  withState('opened', 'setOpened', false),
  withHandlers({
    toggle: ({ setOpened }) => () => setOpened((flag) => !flag),
  }),
  onlyUpdateForKeys(['opened', 'inProgress', 'activities', 'locale']),
)(({ activities, inProgress, opened, toggle }) => (
  <Manager tag={false}>
    <Target onClick={toggle}>
      {inProgress ? (
        <RotatingIcon f={4}>
          <MdDataUsage />
        </RotatingIcon>
      ) : (
        <ToolbarIcon>
          <MdDataUsage />
        </ToolbarIcon>
      )}
    </Target>
    {!opened ? (
      ''
    ) : (
      <div>
        <Fixed top right bottom left onClick={toggle} />
        <Popper placement="bottom-end">
          <ActivityPanel activities={activities} f={1} />
        </Popper>
      </div>
    )}
  </Manager>
));

export default ActivityPanelPopover;
