/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box, Container } from 'rebass';
import { Redirect } from 'react-router-dom';
import { List } from 'immutable';
import SidePanel from './SidePanel';
import MainDashboard from './Main';
import ProviderDashboard from './Provider';
import CoinDashboard from './Coin';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
});

const StickySide = styled(Box)`
  border-bottom: ${(props) => props.theme.colors.gray5} 1px solid;

  @media screen and (min-width: ${(props) => props.theme.breakpoints[1]}em) {
    flex: none;
    order: 0;
    display: block;
    position: sticky;
    top: 52px;
    bottom: 0;
    left: 0;
    height: 100vh;
    overflow: auto;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px,
      rgba(0, 0, 0, 0.23) 0px 3px 10px;
  }
`;

const getProviders = (transactions) => transactions.fetchedAt.keySeq();

const getCoins = (transactions) => transactions.coins.keySeq();

const Dashboard = ({ transactions, match }) => {
  const { type, filter } = match.params;
  const providers = getProviders(transactions);
  const coins = getCoins(transactions);

  return (
    <Flex wrap>
      <StickySide w={[1, 1, 192]}>
        <SidePanel providers={providers} coins={coins} />
      </StickySide>
      <Box w={[1, 1, 'calc(100% - 192px)']} py={3}>
        <Container>
          {type === 'providers' && filter && providers.includes(filter) ? (
            <ProviderDashboard transactions={transactions} provider={filter} />
          ) : type === 'coins' && filter && coins.includes(filter) ? (
            <CoinDashboard
              transactions={transactions.coins.get(filter)}
              coin={filter}
            />
          ) : type === 'all' && !filter ? (
            <MainDashboard transactions={transactions} coin={filter} />
          ) : (
            <Redirect to="/dashboard/all" />
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default connect(mapStateToProps)(Dashboard);
