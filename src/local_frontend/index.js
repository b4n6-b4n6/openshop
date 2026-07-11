import Koa from 'koa';
import { koaBody } from 'koa-body';
import routes from './routes/index.js';
import createBackend from './middlewares/backend.js';
import onionSpinner from './middlewares/onionSpinner.js';
import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';

const backend = await createBackend();
const app = new Koa();

app
  .use(singularAccess())
  .use(onionSpinner())
  .use(backend)
  .use(koaBody())
  .use(exportBrowsedOnion())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
