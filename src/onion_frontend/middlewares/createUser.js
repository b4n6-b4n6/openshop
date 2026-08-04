import createUserClaim from '../utils/createUserClaim.js';
import { JWT_COOKIE_NAME } from '../../const.js';

export default () => async (ctx, next) => {
  if (!ctx.cookies.get(JWT_COOKIE_NAME)) {
    ctx.cookies.set(
      JWT_COOKIE_NAME,
      createUserClaim(),
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    console.log('New user created...');
    ctx.redirect('/browser/');
  } else {
    await next();
  }
};
