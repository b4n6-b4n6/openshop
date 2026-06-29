import Koa from 'koa';
import { koaBody } from 'koa-body';
import routes from './routes/index.js';
// import createBackend from './middlewares/backend';
import session from './middlewares/session.js';
import onionSpinner from './middlewares/onionSpinner.js';
import singularAccess from './middlewares/singularAccess.js';

// const backend = await createBackend();
const app = new Koa();

app
  .use(singularAccess())
  .use(session(app))
  .use(onionSpinner())
  // .use(backend)
  .use(koaBody())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
