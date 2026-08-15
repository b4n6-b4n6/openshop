import { CACHE_CONTROL_FOREVER, CACHE_CONTROL_LIVE } from '../../const';

export default () => {
  const redirectWith303 = (url) => {
    ctx.status = 303;
    ctx.redirect(url);
  };
  const tryCacheEntity = (version) => {
    ctx.set('ETag', `"${version}"`);
    if (ctx.get('if-none-match') === `"${version}"`) {
      ctx.status = 304;
      return true;
    }
    ctx.set('Cache-Control', CACHE_CONTROL_LIVE);
  };
  const tryCachePermanentEntity = (version) => {
    ctx.set('ETag', `"${version}"`);
    if (ctx.get('if-none-match') === `"${version}"`) {
      ctx.status = 304;
      return true;
    }
    ctx.set('Cache-Control', CACHE_CONTROL_FOREVER);
  };

  return async (ctx, next) => {
    ctx.redirectWith303 = redirectWith303;
    ctx.tryCacheEntity = tryCacheEntity;
    ctx.tryCachePermanentEntity = tryCachePermanentEntity;

    await next();
  };
};
