import React from 'react';
import {
  Toolbar,
  NavLink,
} from 'rebass';
import Hide from 'hidden-styled';
import FaPlus from 'react-icons/lib/fa/plus';
import MdDashboard from 'react-icons/lib/md/dashboard';
import MdHistory from 'react-icons/lib/md/history';
import MdAttachMoney from 'react-icons/lib/md/attach-money';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import BottomTooltip from '../BottomTooltip';
import ToolbarIcon from '../ToolbarIcon';
import ActivityPanelPopover from '../../containers/ActivityPanelPopover';

const MobileNavbar = () => (
  <Toolbar>
    <LinkContainer to="/">
      <NavLink f={4}>Bittax</NavLink>
    </LinkContainer>

    <LinkContainer to="/dashboard">
      <NavLink>
        <ToolbarIcon><MdDashboard color="white" /></ToolbarIcon>
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/">
      <NavLink>
        <ToolbarIcon><MdHistory color="white" /></ToolbarIcon>
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/sources">
      <NavLink>
        <ToolbarIcon><MdAttachMoney color="white" /></ToolbarIcon>
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/sources">
      <NavLink ml="auto">
        <ToolbarIcon><FaPlus color="white" /></ToolbarIcon>
      </NavLink>
    </LinkContainer>
    <NavLink>
      <ActivityPanelPopover />
    </NavLink>
  </Toolbar>
);

const NormalNavbar = () => {
  const { formatMessage } = this.context.intl;
  const addExchangeText = formatMessage(messages.addExchange);

  return (
    <Toolbar>
      <LinkContainer to="/">
        <NavLink f={4}>Bittax</NavLink>
      </LinkContainer>

      <LinkContainer to="/dashboard">
        <NavLink>
          <FormattedMessage {...messages.dashboard} />
        </NavLink>
      </LinkContainer>
      <LinkContainer to="/">
        <NavLink>
          <FormattedMessage {...messages.tradeHistories} />
        </NavLink>
      </LinkContainer>
      <LinkContainer to="/sources">
        <NavLink>
          <FormattedMessage {...messages.exchanges} />
        </NavLink>
      </LinkContainer>
      <LinkContainer to="/sources">
        <BottomTooltip text={addExchangeText} ml="auto">
          <NavLink>
            <ToolbarIcon><FaPlus color="white" /></ToolbarIcon>
          </NavLink>
        </BottomTooltip>
      </LinkContainer>
      <NavLink>
        <ActivityPanelPopover />
      </NavLink>
    </Toolbar>
  );
}

const Navbar = () => (
  <div>
    {/* For xs screens */}
    <Hide sm md lg>
      <MobileNavbar />
    </Hide>

    {/* For other screens */}
    <Hide xs>
      <NormalNavbar />
    </Hide>
  </div>
);

export default Navbar;
