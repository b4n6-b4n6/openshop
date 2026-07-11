import Router from '@koa/router';
import root from './root.js';
import browser from './browser.js';
import browserInput from './browserInput.js';
import browserInputPost from './browserInputPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import myShop from './myShop.js';

const router = new Router();
router
  .get('/', root)
  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputPost)
  .all('/browser{/*browsePath}', browser)
  .get('/onion-spinner', onionSpinnerProgress)
  .get('/my-shop', myShop);

export default () => router.routes();
