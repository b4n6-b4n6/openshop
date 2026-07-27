import Koa from 'koa';
import { koaBody } from 'koa-body';

import onionFilter from './middlewares/onionFilter.js';
import walletHandlerMw from './middlewares/walletHandlerMw.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';
import preRoutes from './routes/pre.js';
import routes from './routes/index.js';

import waitForFile from '../utils/waitForFile.js';

import { MY_SHOP_ONION_PATH, MY_SHOP_WALLET_PATH } from '../const.js';
import createMyOnion from './middlewares/myOnion.js';

await waitForFile(MY_SHOP_ONION_PATH);
await waitForFile(MY_SHOP_WALLET_PATH);
const myOnion = await createMyOnion();

const app = new Koa();

app
  .use(preRoutes())
  .use(myOnion)
  .use(onionFilter())
  .use(walletHandlerMw())
  .use(createUser())
  .use(validateUser())
  .use(koaBody())
  .use(routes())
  .listen(7007, () => {
    console.log('Started!');
  });
