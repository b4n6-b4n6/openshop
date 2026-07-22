import Router from '@koa/router';
import ruok from './ruok.js';

const router = new Router();
router
  .get('/ruok', ruok);

export default () => router.routes();
