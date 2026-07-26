import Koa from 'koa';
import { koaBody } from 'koa-body';
import routes from './routes/index.js';

import createWalletSetupMw from './middlewares/walletSetupMw.js';
import createBackendMw from './middlewares/backendMw.js';

import singularAccess from './middlewares/singularAccess.js';
import exportBrowsedOnion from './middlewares/exportBrowsedOnion.js';
import onionSpinner from './middlewares/onionSpinner.js';
import errorHandler from '../middlewares/errorHandler.js';
import staticFiles from '../shared/middlewares/staticFiles.js';
import chromeDevtoolsProbe from '../shared/middlewares/chromeDevtoolsProbe.js';

const walletSetupMw = await createWalletSetupMw();
const backendMw = await createBackendMw();
const port = Number(process.env.LOCAL_PORT ?? 7001);

const app = new Koa();
const bodyParser = koaBody({
  multipart: true,
  formLimit: '15mb',
  formidable: {
    allowEmptyFiles: true,
    maxFileSize: 2 * 1024 * 1024,
    maxFiles: 8,
    minFileSize: 0,
  },
});

app
  .use(errorHandler())
  .use(chromeDevtoolsProbe())
  .use(singularAccess())
  .use(backendMw)
  .use(walletSetupMw)
  .use(onionSpinner())
  .use(staticFiles())
  .use((ctx, next) => (
    ctx.path.startsWith('/browser')
      ? next()
      : bodyParser(ctx, next)
  ))
  .use(exportBrowsedOnion())
  .use(routes())
  .listen(port, () => {
    console.log(`Started local frontend on http://127.0.0.1:${port}`);
  });
