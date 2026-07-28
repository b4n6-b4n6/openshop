import Koa from 'koa';
import routes from './routes/index.js';

import body from './middlewares/body.js';
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
  .use(backendMw)
  .use(walletSetupMw)
  .use(body())
  .use(exportBrowsedOnion())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });
