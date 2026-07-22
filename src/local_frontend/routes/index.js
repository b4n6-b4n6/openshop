import Router from '@koa/router';
import root from './root.js';
import browser from './browser.js';
import browserInput from './browserInput.js';
import browserInputPost from './browserInputPost.js';
import walletSetupProgress from './walletSetupProgress.js';
import walletSetupPost from './walletSetupPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import myShop from './myShop.js';
import selfTest from './selfTest.js';

const router = new Router();
router
  .get('/', root)
  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputPost)
  .get('/wallet-setup', walletSetupProgress)
  .post('/wallet-setup', walletSetupPost)
  .get('/onion-spinner', onionSpinnerProgress)
  .all('/browser{/*browsePath}', browser)
  .get('/my-shop', myShop)
  .get('/self-test', selfTest);

export default () => router.routes();
