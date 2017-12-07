import fetch from 'isomorphic-fetch';
import { merge } from 'lodash-es';

// The proxy to avoid CORS denials.
// We can send a request directly
// if a target server allows us cross-origin requests,
// but unfortunately they don't most of the case.
export default function proxiedFetch(uri, opts) {
  const fetchOpts = merge({}, opts, {
    headers: {
      'X-URL': uri,
    },
  });

  return fetch('/api/proxy', fetchOpts);
}
