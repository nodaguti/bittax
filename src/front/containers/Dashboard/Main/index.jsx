import React, { Component } from 'react';
import styled from 'styled-components';
import { Panel, PanelHead, Flex, Box, Subhead } from 'rebass';

const TotalGainTable = () => {
  return (
    <Box>
      <Subhead>Provider Portfolio</Subhead>
    </Box>
  );
};

const AssetTransition = () => {
  return (
    <Box>
      <Subhead>Asset Transition</Subhead>
    </Box>
  );
};

const AssetPortfolio = () => {
  return (
    <Box>
      <Subhead>Asset Portfolio</Subhead>
    </Box>
  );
};

const ProviderPortfolio = () => {
  return (
    <Box>
      <Subhead>Provider Portfolio</Subhead>
    </Box>
  );
};

class ProviderDashboard extends Component {
  componentWillMount() {
    this.props.dispatch();
  }

  render() {
    const { transactions } = this.props;

    return (
      <Box>
        <TotalGainTable />
        <AssetTransition transactions={transactions} />
        <AssetPortfolio transactions={transactions} />
        <ProviderPortfolio transactions={transactions} />
      </Box>
    );
  }
}

export default ProviderDashboard;
