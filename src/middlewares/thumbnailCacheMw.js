import ThumbnailCache from '../backend/ThumbnailCache/index.js';

export default () => {
  const thumbnailCache = new ThumbnailCache();

  return async (ctx, next) => {
    ctx.thumbnailCache = thumbnailCache;

    await next();
  };
};
