import Router from '@koa/router';

import root from './root.js';
import browser from './browser.js';
import browserInputGet from './browserInputGet.js';
import browserInputPost from './browserInputPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import myShopView from './myShopView.js';

const router = new Router();
router
  .get('/browser-input', browserInputGet)
  .post('/browser-input', browserInputPost)
  .get('/browser', browser)
  // .get('/browser', viewMyShop)
  .get('/onion-spinner', onionSpinnerProgress)
  .get('/my-shop', myShopView)
  .get('/', root);

export default () => router.routes();
