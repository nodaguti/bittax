import request from 'request';

const originWhitelist = [
  'http://localhost:8080',
];

const api = {
  async proxy(ctx) {
    if (!originWhitelist.includes(ctx.request.origin)) {
      ctx.status = 403;
      return;
    }

    const url = ctx.request.headers['x-url'];

    if (!url) {
      ctx.status = 403;
      return;
    }

    ctx.body = ctx.req.pipe(request(url));
  },
};

export default function (router) {
  router.get('/api/proxy', api.proxy);
  router.post('/api/proxy', api.proxy);
}
