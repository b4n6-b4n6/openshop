import ThumbCache from '../../backend/ThumbCache/index.js';

export default () => {
  const thumbCache = new ThumbCache();

  return async (ctx, next) => {
    ctx.thumbCache = thumbCache;

    await next();
  };
};
