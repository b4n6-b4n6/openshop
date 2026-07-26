import readMyShopAddress from '../utils/readMyShopAddress.js';

export default () => async (ctx, next) => {
  const loopbackPreview = process.env.OPENSHOP_ALLOW_LOOPBACK === '1'
    && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ctx.request.ip);

  if (loopbackPreview) {
    await next();
    return;
  }

  if (ctx.request.header.host !== (await readMyShopAddress())) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
