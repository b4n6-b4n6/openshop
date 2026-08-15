import Koa from 'koa';
import routes from './routes/index.js';

import adaptedBody from './middlewares/adaptedBody.js';
import createBackendMw from '../shared/middlewares/backendMw.js';
import createWalletSetupMw from './middlewares/walletSetupMw.js';
import thumbCacheMw from '../shared/middlewares/thumbCacheMw.js';
import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';
import onionSpinner from './middlewares/onionSpinner.js';
import requireOnion from './middlewares/requireOnion.js';
import staticFiles from '../shared/middlewares/staticFiles.js';
import utilsMw from '../shared/middlewares/utilsMw.js';

const walletSetupMw = await createWalletSetupMw();
const backendMw = await createBackendMw();

const app = new Koa();

const server = app
  .use(utilsMw())
  .use(adaptedBody())
  .use(backendMw)
  .use(thumbCacheMw())
  .use(onionSpinner())
  .use(walletSetupMw)
  .use(requireOnion())
  .use(singularAccess())
  .use(staticFiles())
  .use(exportBrowsedOnion())
  .use(routes())
  .listen(7001, () => {
    console.log('Started!');
  });

server.keepAliveTimeout = 0;
