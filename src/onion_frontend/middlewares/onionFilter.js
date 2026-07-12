import readMyShopAddress from '../utils/readMyShopAddress.js';

export default () => async (ctx, next) => {
  if (ctx.request.header.host !== (await readMyShopAddress())) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
