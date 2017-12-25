import React from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Toolbar, NavLink } from 'rebass';
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

const Link = styled(({ children, ...props }) => (
  <NavLink is={RouterLink} to={props.href} {...props}>
    {children}
  </NavLink>
))([], (props) => {
  const indicator = {
    '&::after': {
      content: '""',
      width: '100%',
      height: '2px',
      backgroundColor: props.theme.colors.blue3,
    },
  };
  let styles = {
    flexDirection: 'column',

    '&:hover': {
      ...indicator,
    },
  };

  if (props.active) {
    styles = { ...styles, ...indicator };
  }

  return styles;
});

const LinkItem = ({ children, ...props }) => (
  <Box pt="12px" pb={1} {...props}>
    {children}
  </Box>
);

const Navbar = ({ location: { pathname } }, { intl: { formatMessage } }) => {
  const addExchangeText = formatMessage(messages.addExchange);

  return (
    <Box>
      <Toolbar>
        <NavLink is={RouterLink} to="/" href="/" f={4}>
          Bittax
        </NavLink>
        <Link
          is={RouterLink}
          href="/dashboard"
          active={pathname.startsWith('/dashboard')}
        >
          <LinkItem>
            <Hide sm md lg>
              <ToolbarIcon>
                <MdDashboard color="white" />
              </ToolbarIcon>
            </Hide>
            <Hide xs>
              <FormattedText {...messages.dashboard} />
            </Hide>
          </LinkItem>
        </Link>
        <Link is={RouterLink} href="/sources" active={pathname === '/sources'}>
          <LinkItem>
            <Hide sm md lg>
              <ToolbarIcon>
                <MdAttachMoney color="white" />
              </ToolbarIcon>
            </Hide>
            <Hide xs>
              <FormattedText {...messages.exchanges} />
            </Hide>
          </LinkItem>
        </Link>

        <BottomTooltip text={addExchangeText} ml="auto">
          <NavLink is={RouterLink} to="/sources" href="/sources">
            <ToolbarIcon>
              <FaPlus color="white" />
            </ToolbarIcon>
          </NavLink>
        </BottomTooltip>
        <NavLink>
          <ActivityPanelPopover />
        </NavLink>
      </Toolbar>
    </Box>
  );
};

// Allow Navbar to reference `context`.
Navbar.contextTypes = {
  intl: intlShape,
};

export default withRouter(Navbar);
