export default () => async (ctx, next) => {
  if (!ctx.path.startsWith('/browser/')) {
    ctx.redirect('/browser/');
    return;
  }
  await next();
};
