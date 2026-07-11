import readMyShopOnion from '../utils/readMyShopOnion.js';

export default () => async (ctx, next) => {
  if (ctx.request.header.host !== (await readMyShopOnion())) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
