import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import logger from 'koa-log';
import path from 'path';
import routes from './routes';

export default function() {
  const app = new Koa();
  const port = process.env.PORT || 8080;
  const assetsPath = path.resolve(__dirname, '../../dist/assets');

  app.use(logger());
  app.use(compress());
  app.use(mount('/assets', serve(assetsPath)));
  routes(app);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`The REST server is listening on port ${port}`);
  });
}
