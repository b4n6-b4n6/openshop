import readMyShopOnion from '../utils/readMyShopOnion.js';

export default () => async (ctx, next) => {
  const onion = await readMyShopOnion();

  if (ctx.request.header.host !== onion) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
