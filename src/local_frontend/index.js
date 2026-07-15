import Koa from 'koa';
import { koaBody } from 'koa-body';
import routes from './routes/index.js';

import createWalletSetupMw from './middlewares/walletSetupMw.js';
import createBackendMw from './middlewares/backendMw.js';

import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';
import onionSpinner from './middlewares/onionSpinner.js';

const walletSetupMw = await createWalletSetupMw();
const backendMw = await createBackendMw();

const app = new Koa();

app
  .use(singularAccess())
  .use(onionSpinner())
  .use(walletSetupMw)
  .use(backendMw)
  .use(koaBody())
  .use(exportBrowsedOnion())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
