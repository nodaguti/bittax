import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Toolbar,
  NavLink,
} from 'rebass';
import Hide from 'hidden-styled';
import FaPlus from 'react-icons/lib/fa/plus';
import MdDashboard from 'react-icons/lib/md/dashboard';
import MdAttachMoney from 'react-icons/lib/md/attach-money';
import { intlShape } from 'react-intl';
import messages from './messages';
import FormattedText from '../FormattedText';
import BottomTooltip from '../BottomTooltip';
import ToolbarIcon from '../ToolbarIcon';
import ActivityPanelPopover from '../../containers/ActivityPanelPopover';

const Navbar = (_, { intl: { formatMessage } }) => {
  const addExchangeText = formatMessage(messages.addExchange);

  return (
    <Box>
      <Toolbar>
        <NavLink
          is={RouterLink}
          to="/"
          href="/"
          f={4}
        >
          Bittax
        </NavLink>
        <NavLink
          is={RouterLink}
          to="/dashboard"
          href="/dashboard"
        >
          <Hide sm md lg>
            <ToolbarIcon><MdDashboard color="white" /></ToolbarIcon>
          </Hide>
          <Hide xs>
            <FormattedText {...messages.dashboard} />
          </Hide>
        </NavLink>
        <NavLink
          is={RouterLink}
          to="/sources"
          href="/sources"
        >
          <Hide sm md lg>
            <ToolbarIcon><MdAttachMoney color="white" /></ToolbarIcon>
          </Hide>
          <Hide xs>
            <FormattedText {...messages.exchanges} />
          </Hide>
        </NavLink>

        <BottomTooltip
          text={addExchangeText}
          ml="auto"
        >
          <NavLink
            is={RouterLink}
            to="/sources"
            href="/sources"
          >
            <ToolbarIcon><FaPlus color="white" /></ToolbarIcon>
          </NavLink>
        </BottomTooltip>
        <NavLink>
          <ActivityPanelPopover />
        </NavLink>
      </Toolbar>
    </Box>
  )
};

// Allow Navbar to reference `context`.
Navbar.contextTypes = {
  intl: intlShape,
};

export default Navbar;
