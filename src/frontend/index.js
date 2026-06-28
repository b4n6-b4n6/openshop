import Koa from 'koa';
// import createBackend from './middlewares/backend';
import routes from './routes/index.js';
import singularAccess from './middlewares/singularAccess.js';

// const backend = await createBackend();
const app = new Koa();

app
  // .use(backend)
  .use(singularAccess())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
