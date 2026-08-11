import ImageHashCache from '../../backend/ImageHashCache/index.js';

export default () => {
  const imageHashCache = new ImageHashCache();

  return async (ctx, next) => {
    ctx.imageHashCache = imageHashCache;

    await next();
  };
};
