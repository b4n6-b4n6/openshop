import Router from '@koa/router';
import root from './root.js';
import browser from './browser.js';
import browserInput from './browserInput.js';
import browserInputPost from './browserInputPost.js';
import walletSetupProgress from './walletSetupProgress.js';
import walletSetupPost from './walletSetupPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import viewShop from './viewShop.js';
import editShop from './editShop.js';
import editShopPost from './editShopPost.js';
import selfTest from './selfTest.js';
import syncStatus from './syncStatus.js';

const router = new Router();
router
  .get('/', root)
  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputPost)
  .get('/wallet-setup', walletSetupProgress)
  .post('/wallet-setup', walletSetupPost)
  .get('/onion-spinner', onionSpinnerProgress)
  .all('/browser{/*browsePath}', browser)
  .get('/shop', viewShop)
  .get('/shop/settings', editShop)
  .post('/shop/settings', editShopPost)
  .get('/self-test', selfTest)
  .get('/sync-status', syncStatus);

export default () => router.routes();
