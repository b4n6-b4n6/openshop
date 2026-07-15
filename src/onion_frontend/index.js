import Koa from 'koa';
import { koaBody } from 'koa-body';

import routes from './routes/index.js';
import onionFilter from './middlewares/onionFilter.js';
import waitForFile from '../utils/waitForFile.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';

import { MY_SHOP_ONION_PATH } from '../const.js';

(async () => {
  await waitForFile(MY_SHOP_ONION_PATH);

  const app = new Koa();

  app
    .use(onionFilter())
    .use(createUser())
    .use(validateUser())
    .use(koaBody())
    .use(routes())
    .listen(7007, () => {
      console.log('Started!');
    });
})();
