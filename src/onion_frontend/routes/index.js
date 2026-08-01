import Router from '@koa/router';
import shop from './shop.js';
import products from './products.js';
import product from './product.js';

const router = new Router();
router
  .get('/browser/', shop)
  .get('/browser/products', products)
  .get('/browser/products/:id', product);

export default () => router.routes();
