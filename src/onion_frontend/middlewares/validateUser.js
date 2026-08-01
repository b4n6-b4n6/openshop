import jwt from 'koa-jwt';
import compose from 'koa-compose';
import { JWT_SECRET, JWT_COOKIE_NAME } from '../../const.js';

export default () => compose([
  jwt({
    secret: JWT_SECRET,
    cookie: JWT_COOKIE_NAME,
    passthrough: true,
  }),
  async (ctx, next) => {
    if (
      ctx.cookies.get(JWT_COOKIE_NAME) && ctx.state.jwtOriginalError
    ) {
      console.log(ctx.state.jwtOriginalError);
      ctx.cookies.set(JWT_COOKIE_NAME, null);

      ctx.redirect('/browser/');
    } else {
      await next();
    }
  },
]);
