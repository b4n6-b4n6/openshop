import Router from '@koa/router';
import shop from './shop.js';
import products from './products.js';

const router = new Router();
router
  .get('/browser/', shop)
  .get('/browser/products', products);

export default () => router.routes();
