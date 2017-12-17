import Bottleneck from 'bottleneck';
import fetch from 'isomorphic-fetch';

const limiter = new Bottleneck(5, 3100); // 6000 requests per hour

const fetchAPI = async (url, { params, ...opts } = {}) => {
  const searchParams = new URLSearchParams(params);
  const res = await limiter.schedule(
    fetch,
    `${url}?${searchParams.toString()}`,
    opts,
  );
  const json = await res.json();

  if (json.Reponse !== 'Success') {
    throw new Error(`${json.Message}: type ${json.Type}`);
  }

  return json.Data;
};

export default fetchAPI;
