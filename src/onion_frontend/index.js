import Koa from 'koa';
import { koaBody } from 'koa-body';

import routes from './routes/index.js';
import onionFilter from './middlewares/onionFilter.js';
import waitForMyShopOnion from './utils/waitForMyShopOnion.js';

(async () => {
  console.log('Waiting for my onion...');
  await waitForMyShopOnion();

  const app = new Koa();

  app
    .use(koaBody())
    .use(onionFilter())
    .use(routes())
    .listen(7007, () => {
      console.log('Started!');
    });
})();
