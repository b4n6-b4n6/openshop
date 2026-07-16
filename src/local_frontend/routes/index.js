import Router from '@koa/router';
import api from './api.js';
import browser from './browser.js';

const router = new Router();
router
  .all('/browser{/*browsePath}', browser);

export default () => async (ctx, next) => {
  await api()(ctx, async () => router.routes()(ctx, next));
};
