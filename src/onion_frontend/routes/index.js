import Router from '@koa/router';
import shop from './shop.js';

const router = new Router();
router
  .get('/', shop);

export default () => router.routes();
