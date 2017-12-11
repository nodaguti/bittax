import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Manager,
  Target,
  Popper,
} from 'react-popper';
import {
  Fixed,
} from 'rebass';
import styled, { keyframes } from 'styled-components';
import MdDataUsage from 'react-icons/lib/md/data-usage';
import ActivityPanel from '../../components/ActivityPanel';
import ToolbarIcon from '../../components/ToolbarIcon';

const mapStateToProps = (state) => ({
  activities: state.activities,
});

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

class ActivityPanelPopover extends Component {
  constructor(props) {
    super(props);
    this.state = { opened: false };
  }

  toggle = () => {
    this.setState({ opened: !this.state.opened });
  }

  render() {
    const { activities } = this.props;

    return (
      <Manager tag={false}>
        <Target onClick={this.toggle}>
          {
            activities.size === 0 ? (
              <ToolbarIcon>
                <MdDataUsage />
              </ToolbarIcon>
            ) : (
              <RotatingIcon f={4}>
                <MdDataUsage />
              </RotatingIcon>
            )
          }
        </Target>
        {
          !this.state.opened ? '' : (
            <div>
              <Fixed
                top
                right
                bottom
                left
                onClick={this.toggle}
              />
              <Popper placement="bottom-end">
                <ActivityPanel activities={activities} f={1} />
              </Popper>
            </div>
          )
        }
      </Manager>
    );
  }
}

export default connect(mapStateToProps)(ActivityPanelPopover);
