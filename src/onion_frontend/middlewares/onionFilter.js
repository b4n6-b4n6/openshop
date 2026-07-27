export default () => async (ctx, next) => {
  if (ctx.request.header.host !== ctx.myOnion) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
