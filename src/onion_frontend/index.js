import Koa from 'koa';
import { koaBody } from 'koa-body';

import routes from './routes/index.js';
import onionFilter from './middlewares/onionFilter.js';
import waitForMyShopOnion from './utils/waitForMyShopOnion.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';
import createConstants from './middlewares/constants.js';

(async () => {
  console.log('Waiting for my onion...');
  await waitForMyShopOnion();

  const constants = await createConstants();
  const app = new Koa();

  app
    .use(constants)
    .use(onionFilter())
    .use(createUser())
    .use(validateUser())
    .use(koaBody())
    .use(routes())
    .listen(7007, () => {
      console.log('Started!');
    });
})();
