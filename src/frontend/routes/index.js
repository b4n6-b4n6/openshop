import Router from '@koa/router';
import root from './root.js';

const router = new Router();
router
  .get('/', root);

export default router.routes();
