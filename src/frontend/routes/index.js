import Router from '@koa/router';
import root from './root.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import viewMyShop from './viewMyShop.js';

const router = new Router();
router
  .get('/onion-spinner-progress', onionSpinnerProgress)
  .get('/view-my-shop', viewMyShop)
  .get('/', root);

export default () => router.routes();
