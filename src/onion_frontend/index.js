import Koa from 'koa';
import { koaBody } from 'koa-body';

import onionFilter from './middlewares/onionFilter.js';
import walletHandlerMw from './middlewares/walletHandlerMw.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';
import routes from './routes/index.js';
import createBackendMw from '../backend/middleware.js';

import waitForFile from '../utils/waitForFile.js';
import errorHandler from '../middlewares/errorHandler.js';
import internalStatus from './middlewares/internalStatus.js';
import staticFiles from '../shared/middlewares/staticFiles.js';
import chromeDevtoolsProbe from '../shared/middlewares/chromeDevtoolsProbe.js';

import { MY_SHOP_ONION_PATH } from '../const.js';

(async () => {
  await waitForFile(MY_SHOP_ONION_PATH);
  const backendMw = await createBackendMw();
  const port = Number(process.env.ONION_PORT ?? 7007);
  const bodyParser = koaBody({
    multipart: true,
    formLimit: '15mb',
    formidable: {
      allowEmptyFiles: true,
      maxFileSize: 2 * 1024 * 1024,
      maxFiles: 2,
      minFileSize: 0,
    },
  });

  const app = new Koa();

  app
    .use(errorHandler())
    .use(chromeDevtoolsProbe())
    .use(walletHandlerMw())
    .use(internalStatus())
    .use(onionFilter())
    .use(staticFiles())
    .use(backendMw)
    .use(validateUser())
    .use(createUser())
    .use(bodyParser)
    .use(routes())
    .listen(port, () => {
      console.log(`Started onion frontend on http://127.0.0.1:${port}`);
    });
})();
