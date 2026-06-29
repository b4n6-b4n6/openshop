import Router from '@koa/router';

import root from './root.js';
import browser from './browser.js';
import browserInput from './browserInput.js';
import browserInputPost from './browserInputPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import myShop from './myShop.js';

const router = new Router();
router
  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputPost)
  .get('/browser', browser)
  // .get('/browser', viewMyShop)
  .get('/onion-spinner', onionSpinnerProgress)
  .get('/my-shop', myShop)
  .get('/', root);

export default () => router.routes();
