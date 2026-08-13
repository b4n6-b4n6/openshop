import Router from '@koa/router';
import shop from './shop.js';
import products from './products.js';
import product from './product.js';
import productPost from './productPost.js';
import convo from './convo.js';
import convoThread from './convoThread.js';
import convoPost from './convoPost.js';
import order from './order.js';
import orders from './orders.js';
import ordersThread from './ordersThread.js';
import downloadImage from '../../shared/routes/downloadImage.js';

const router = new Router();
router
  .get('/browser/', shop)

  .get('/browser/products', products)
  .get('/browser/products/:id', product)
  .post('/browser/products/:id', productPost)

  .get('/browser/orders', orders)
  .get('/browser/orders/thread', ordersThread)
  .get('/browser/orders/:id', order)

  .get('/browser/convo', convo)
  .post('/browser/convo', convoPost)
  .get('/browser/convo/thread', convoThread)

  .get('/browser/convo/images/:id', downloadImage);

export default () => router.routes();
