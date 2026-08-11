import Koa from 'koa';

import {
  MY_SHOP_ONION_PATH,
  MY_SHOP_WALLET_PATH,
} from '../const.js';

import waitForFile from '../utils/waitForFile.js';

import body from '../shared/middlewares/body.js';
import onionFilter from './middlewares/onionFilter.js';
import walletHandlerMw from './middlewares/walletHandlerMw.js';
import createUser from './middlewares/createUser.js';
import validateUser from './middlewares/validateUser.js';
import receiveMessages from './middlewares/receiveMessages.js';
import createBackendMw from '../shared/middlewares/backendMw.js';
import imageHashCacheMw from '../shared/middlewares/imageHashCacheMw.js';
import thumbnailCacheMw from '../shared/middlewares/thumbnailCacheMw.js';
import createMyOnion from './middlewares/myOnion.js';
import staticFiles from '../shared/middlewares/staticFiles.js';

import preRoutes from './routes/pre.js';
import browserPathRedirect from './middlewares/browserPathRedirect.js';
import routes from './routes/index.js';

await waitForFile(MY_SHOP_ONION_PATH);
await waitForFile(MY_SHOP_WALLET_PATH);

const myOnion = await createMyOnion();
const backendMw = await createBackendMw();

const app = new Koa();

const server = app
  .use(body())
  .use(backendMw)
  .use(imageHashCacheMw())
  .use(thumbnailCacheMw())
  .use(myOnion)
  .use(walletHandlerMw())
  .use(onionFilter())
  .use(preRoutes())
  .use(staticFiles())
  .use(browserPathRedirect())
  .use(createUser())
  .use(validateUser())
  .use(receiveMessages())
  .use(routes())
  .listen(7007, () => {
    console.log('Started!');
  });

server.keepAliveTimeout = 0;
