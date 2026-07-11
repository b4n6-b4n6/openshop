import Koa from 'koa';
import { koaBody } from 'koa-body';

import routes from './routes/index.js';
import onionFilter from './middlewares/onionFilter.js';
import waitForMyShopOnion from './utils/waitForMyShopOnion.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';

(async () => {
  console.log('Waiting for my onion...');
  await waitForMyShopOnion();

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
