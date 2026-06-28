import Koa from 'koa';
// import createBackend from './middlewares/backend';
import routes from './routes/index.js';
import singularAccess from './middlewares/singularAccess.js';
import onionSpinner from './middlewares/onionSpinner.js';

// const backend = await createBackend();
const app = new Koa();

app
  // .use(backend)
  .use(onionSpinner())
  .use(singularAccess())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
