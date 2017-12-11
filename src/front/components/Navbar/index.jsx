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

const NormalNavbar = () => (
  <Toolbar>
    <LinkContainer to="/">
      <NavLink f={4}>Bittax</NavLink>
    </LinkContainer>

    <LinkContainer to="/dashboard">
      <NavLink>
        ダッシュボード
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/">
      <NavLink>
        取引履歴
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/sources">
      <NavLink>
        取引所一覧
      </NavLink>
    </LinkContainer>
    <LinkContainer to="/sources">
      <BottomTooltip text="取引所のデータを追加" ml="auto">
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
