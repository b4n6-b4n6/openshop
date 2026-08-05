const OWNER_PATH = /^\/shop(?:\/|$)/;

export default () => async (ctx, next) => {
  if (OWNER_PATH.test(ctx.path) && !ctx.onionSpinner.onion) {
    ctx.redirect('/onion-spinner');
    return;
  }

  await next();
};
