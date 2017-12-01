import { Record } from 'immutable';

export const ImmutableError = new Record({
  name: '',
  message: '',
  details: {
    name: '',
    message: '',
    stack: '',
  },
}, 'error');
