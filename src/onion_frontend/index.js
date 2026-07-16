import Koa from 'koa';
import { koaBody } from 'koa-body';
import { fileURLToPath } from 'node:url';

import onionFilter from './middlewares/onionFilter.js';
import walletHandlerMw from './middlewares/walletHandlerMw.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';
import routes from './routes/index.js';
import createBackendMw from '../backend/middleware.js';

import waitForFile from '../utils/waitForFile.js';
import serveSpa from '../utils/serveSpa.js';
import errorHandler from '../middlewares/errorHandler.js';

import { MY_SHOP_ONION_PATH } from '../const.js';

(async () => {
  await waitForFile(MY_SHOP_ONION_PATH);
  const backendMw = await createBackendMw();
  const frontendPath = fileURLToPath(new URL('../../frontend/dist/onion/', import.meta.url));

  const app = new Koa();

  app
    .use(errorHandler())
    .use(onionFilter())
    .use(backendMw)
    .use(walletHandlerMw())
    .use(validateUser())
    .use(createUser())
    .use(koaBody())
    .use(routes())
    .use(serveSpa(frontendPath))
    .listen(7007, () => {
      console.log('Started!');
    });
})();
