import React from 'react';
import {
  Navbar,
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip,
  Popover,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import ActivityList from '../containers/ActivityList';

const sourceAddTooltip = (
  <Tooltip>各取引所の取引データを追加</Tooltip>
);

const activityListPopover = (
  <Popover id="activity-list-popover">
    <ActivityList />
  </Popover>
);

const Header = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <Link href="/" to="/">Bittax</Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      <Navbar.Form pullRight>
        <OverlayTrigger placement="bottom" overlay={sourceAddTooltip}>
          <LinkContainer to="/sources" activeClassName="">
            <Button bsStyle="primary">
              <Glyphicon glyph="plus" />
            </Button>
          </LinkContainer>
        </OverlayTrigger>
        <OverlayTrigger trigger="click" placement="bottom" overlay={activityListPopover}>
          <Button>
            <Glyphicon glyph="tasks" />
          </Button>
        </OverlayTrigger>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
