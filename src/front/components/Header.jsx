import React from 'react';
import {
  Toolbar,
  NavLink,
  Text,
} from 'rebass';
import FaPlus from 'react-icons/lib/fa/plus';
import { LinkContainer } from 'react-router-bootstrap';
import BottomTooltip from './BottomTooltip';
import ToolbarIcon from './ToolbarIcon';
import ActivityPanelPopover from '../containers/ActivityPanelPopover';

const Header = () => (
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

export default Header;
