import { defineMessages } from 'react-intl';

export default defineMessages({
  authenticationError: 'Authentication Error',
  authenticationErrorMessage: 'An error has been occurred during OAuth authentication. Please try again.',
  connectionError: 'Connection Error',
  connectionErrorMessage: '{provider} has been disconnected. Please connect it again at /sources.',
  targetWindowClosed: 'Saving authentication data has been failed. Did you close the original Bittax\'s window/tab?',
});
