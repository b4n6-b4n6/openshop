/* eslint-disable consistent-return */
import { CACHE_CONTROL_FOREVER, CACHE_CONTROL_LIVE } from '../../const.js';

export default () => {
  const redirectWith303 = function (url) {
    this.status = 303;
    this.redirect(url);
  };
  const tryCacheEntity = function (version) {
    this.set('ETag', `"${version}"`);
    if (this.get('if-none-match') === `"${version}"`) {
      this.status = 304;
      return true;
    }
    this.set('Cache-Control', CACHE_CONTROL_LIVE);
  };
  const tryCachePermanentEntity = function (version) {
    this.set('ETag', `"${version}"`);
    if (this.get('if-none-match') === `"${version}"`) {
      this.status = 304;
      return true;
    }
    this.set('Cache-Control', CACHE_CONTROL_FOREVER);
  };

  return async (ctx, next) => {
    ctx.redirectWith303 = redirectWith303;
    ctx.tryCacheEntity = tryCacheEntity;
    ctx.tryCachePermanentEntity = tryCachePermanentEntity;

    await next();
  };
};
