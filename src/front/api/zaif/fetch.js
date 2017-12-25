import Bottleneck from 'bottleneck';
import { merge } from 'lodash-es';
import Nonce from '../utils/nonce';
import fetch from '../utils/proxied-fetch';

const fetchLimiter = new Bottleneck(1, 3500);
const enqueueLimiter = new Bottleneck(1);
const nonce = new Nonce();

/**
 * This func should be called via `enqueueLimiter#schedule`
 * to make sure `nonce#next` is never executed concurrently
 */
const enqueueFetch = (url, { params, ...opts } = {}, isPrivate = false) => {
  if (isPrivate) {
    const n = nonce.next() / 1e14;

    // eslint-disable-next-line no-param-reassign
    params = { ...params, nonce: n };
  }

  if (params) {
    const searchParams = new URLSearchParams(params);

    // eslint-disable-next-line no-param-reassign
    opts = merge({}, opts, {
      method: 'POST',
      body: searchParams,
    });
  }

  return fetchLimiter.schedule(fetch, url, opts);
};

const fetchAPI = async (url, { params, ...opts } = {}, isPrivate = false) => {
  const req = enqueueLimiter.schedule(
    enqueueFetch,
    url,
    { params, ...opts },
    isPrivate,
  );
  const res = await req;
  const resForErrorHandling = res.clone();

  try {
    const json = await res.json();

    if (!isPrivate) {
      return json;
    }

    if (json.success !== 1) {
      const retryableMessages = [
        'time wait restriction, please try later.',
        'nonce not incremented',
      ];
      const message = json.return || res.headers.get('x-message');

      if (retryableMessages.includes(message)) {
        console.warn(
          `Retry: "${message}" from ${url} (params: ${JSON.stringify({
            params,
            ...opts,
          })})`,
        );
        return fetchAPI(url, { params, ...opts }, isPrivate);
      }

      throw new Error(`Server Error: ${message}`);
    }

    return json.return;
  } catch (ex) {
    const text = await resForErrorHandling.text();

    if (text.includes('Bad Gateway')) {
      console.warn(
        `Retry: Got the following from ${url} (params: ${JSON.stringify({
          params,
          ...opts,
        })}):\n\n${text}`,
      );
      return fetchAPI(url, { params, ...opts }, isPrivate);
    }

    console.error(
      `Got the following from ${url} (params: ${JSON.stringify({
        params,
        ...opts,
      })}):\n\n${text}`,
    );
    throw ex;
  }
};

export default fetchAPI;
