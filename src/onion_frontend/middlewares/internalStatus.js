const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

export default () => async (ctx, next) => {
  if (ctx.method !== 'GET' || ctx.path !== '/internal/status') {
    await next();
    return;
  }

  if (!LOOPBACK_ADDRESSES.has(ctx.request.ip)) {
    ctx.throw(403, 'Internal status is only available over loopback');
  }

  ctx.body = {
    wallet: await ctx.walletHandler.getSyncState(),
  };
};
