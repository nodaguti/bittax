import React from 'react';
import styled from 'styled-components';
import { Flex, Box, NavLink } from 'rebass';
import { Link, withRouter } from 'react-router-dom';
import { getProviderName } from '../../../providers';
import FormattedText from '../../../components/FormattedText';
import messages from './messages';

const LinkGroupTitle = styled((props) => (
  <NavLink is={Link} to={props.href} f={3} pl={3} w={1} {...props} />
))([], (props) => ({
  display: 'inline-block',
  fontWeight: '300',
  cursor: props.href ? 'pointer' : 'default',
  backgroundColor: props.active ? props.theme.colors.gray3 : 'transparent',
  '&:hover': {
    backgroundColor:
      props.href === '#' // eslint-disable-line no-nested-ternary
        ? 'transparent'
        : props.active ? props.theme.colors.gray3 : null,
  },
}));

const LinkGroup = ({ name, children, ...props }) => (
  <Box w={[1 / 3, 1 / 3, 1]}>
    <LinkGroupTitle {...props}>{name}</LinkGroupTitle>
    <Box>{children}</Box>
  </Box>
);

const LinkGroupItem = styled(({ children, ...props }) => (
  <NavLink is={Link} to={props.href} f={2} pl={4} py={1} w={1} {...props}>
    {children}
  </NavLink>
))([], (props) => ({
  display: 'inline-block',
  fontWeight: '300',
  cursor: props.href ? 'pointer' : 'default',
  backgroundColor: props.active ? props.theme.colors.gray3 : 'transparent',
  '&:hover': {
    backgroundColor: props.active ? props.theme.colors.gray3 : null,
  },
}));

const SidePanel = ({ providers, coins, location: { pathname } }) => (
  <nav>
    <Flex wrap py={3}>
      <LinkGroup
        key="all"
        href="/dashboard/all"
        name={<FormattedText {...messages.all} />}
        active={pathname === '/dashboard/all'}
      />
      <LinkGroup
        key="providers"
        href="#"
        name={<FormattedText {...messages.providers} />}
      >
        {providers.map((provider) => (
          <LinkGroupItem
            key={provider}
            href={`/dashboard/providers/${provider}`}
            active={pathname === `/dashboard/providers/${provider}`}
          >
            {getProviderName(provider)}
          </LinkGroupItem>
        ))}
      </LinkGroup>
      <LinkGroup
        key="coins"
        href="#"
        name={<FormattedText {...messages.coins} />}
      >
        {coins.map((coin) => (
          <LinkGroupItem
            key={coin}
            href={`/dashboard/coins/${coin}`}
            active={pathname === `/dashboard/coins/${coin}`}
          >
            {coin.toUpperCase()}
          </LinkGroupItem>
        ))}
      </LinkGroup>
    </Flex>
  </nav>
);

export default withRouter(SidePanel);
