import jwt from 'koa-jwt';
import compose from 'koa-compose';
import { JWT_SECRET } from '../../const.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';

export default () => compose([
  jwt({
    secret: JWT_SECRET,
    getToken: (ctx) => (ctx.cookies.get(ctx.constants.JWT_COOKIE_NAME)),
    passthrough: true,
  }),
  async (ctx, next) => {
    const { JWT_COOKIE_NAME } = ctx.constants;

    if (
      ctx.cookies.get(JWT_COOKIE_NAME) && ctx.state.jwtOriginalError
    ) {
      console.log(ctx.state.jwtOriginalError);
      ctx.cookies.set(JWT_COOKIE_NAME, null);

      ctx.redirect(checkOpenShopBrowser(ctx) ? '/browser/' : '/');
    } else {
      await next();
    }
  },
]);
