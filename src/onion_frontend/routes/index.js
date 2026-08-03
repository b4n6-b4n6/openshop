import Router from '@koa/router';
import shop from './shop.js';
import products from './products.js';
import product from './product.js';
import productPost from './productPost.js';
import convo from './convo.js';
import convoPost from './convoPost.js';
import order from './order.js';

const router = new Router();
router
  .get('/browser/', shop)
  .get('/browser/products', products)
  .get('/browser/products/:id', product)
  .post('/browser/products/:id', productPost)
  .get('/browser/orders/:id', order)
  .get('/browser/convo', convo)
  .post('/browser/convo', convoPost);

export default () => router.routes();
