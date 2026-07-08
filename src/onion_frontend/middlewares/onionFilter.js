export default () => async (ctx, next) => {
  if (ctx.request.header.host !== ctx.constants.MY_SHOP_ONION) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
