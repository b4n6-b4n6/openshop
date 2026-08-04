import body from '../../middlewares/body.js';

export default () => {
  const bodyMw = body();

  return async (ctx, next) => {
    if (!ctx.path.startsWith('/browser/')) {
      await bodyMw(ctx, next);
      return;
    }

    await next();
  };
};
