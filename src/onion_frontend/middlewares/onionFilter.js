const { BYPASS_ONION_FILTER } = process.env;

export default () => async (ctx, next) => {
  if (BYPASS_ONION_FILTER) {
    await next();
    return;
  }

  if (ctx.request.header.host !== ctx.myOnion) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
