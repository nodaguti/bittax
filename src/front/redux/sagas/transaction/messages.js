import { defineMessages } from 'react-intl';

export default defineMessages({
  connectionError: 'Connection Error',
  connectionErrorMessage:
    "Fetching transaction data from {provider} has been failed. The provider's server might down.",
  fetchTrades: '{provider}: Fetching trade histories',
  fetchWithdrawals: '{provider}: Fetching withdrawal histories',
  fetchDeposits: '{provider}: Fetching deposit histories',
});
