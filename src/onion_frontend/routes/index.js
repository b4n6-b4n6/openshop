import Router from '@koa/router';
import shop from './shop.js';

const router = new Router();
router
  .get('/browser/', shop);

export default () => router.routes();
