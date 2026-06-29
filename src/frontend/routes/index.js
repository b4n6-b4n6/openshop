import Router from '@koa/router';

import root from './root.js';
import browserInput from './browserInput.js';
import browserInputAddress from './browserInputAddress.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import viewMyShop from './viewMyShop.js';

const router = new Router();
router
  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputAddress)
  // .get('/browser', viewMyShop)
  .get('/onion-spinner', onionSpinnerProgress)
  .get('/my-shop', viewMyShop)
  .get('/', root);

export default () => router.routes();
