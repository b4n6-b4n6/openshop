import Koa from 'koa';
import { koaBody } from 'koa-body';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';

import createWalletSetupMw from './middlewares/walletSetupMw.js';
import createBackendMw from './middlewares/backendMw.js';

import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';
import onionSpinner from './middlewares/onionSpinner.js';
import serveSpa from '../utils/serveSpa.js';
import errorHandler from '../middlewares/errorHandler.js';

const walletSetupMw = await createWalletSetupMw();
const backendMw = await createBackendMw();

const app = new Koa();
const frontendPath = fileURLToPath(new URL('../../frontend/dist/local/', import.meta.url));

app
  .use(errorHandler())
  .use(singularAccess())
  .use(backendMw)
  .use(walletSetupMw)
  .use(onionSpinner())
  .use(koaBody())
  .use(exportBrowsedOnion())
  .use(routes())
  .use(serveSpa(frontendPath))
  .listen(7001, () => {
    console.log('Started!');
  });
