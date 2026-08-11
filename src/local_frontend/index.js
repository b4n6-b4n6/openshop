import Koa from 'koa';
import routes from './routes/index.js';

import adaptedBody from './middlewares/adaptedBody.js';
import createBackendMw from '../shared/middlewares/backendMw.js';
import createWalletSetupMw from './middlewares/walletSetupMw.js';
import imageHashCacheMw from '../shared/middlewares/imageHashCacheMw.js';
import thumbnailCacheMw from '../shared/middlewares/thumbnailCacheMw.js';
import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';
import onionSpinner from './middlewares/onionSpinner.js';
import requireOnion from './middlewares/requireOnion.js';
import staticFiles from '../shared/middlewares/staticFiles.js';

const walletSetupMw = await createWalletSetupMw();
const backendMw = await createBackendMw();

const app = new Koa();

const server = app
  .use(adaptedBody())
  .use(backendMw)
  .use(imageHashCacheMw())
  .use(thumbnailCacheMw())
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
