import jwt from 'jsonwebtoken';
import { JWT_COOKIE_NAME } from '../../const.js';
import createUserClaim from '../utils/createUserClaim.js';

export default () => async (ctx, next) => {
  if (!ctx.cookies.get(JWT_COOKIE_NAME)) {
    const claim = createUserClaim();
    ctx.cookies.set(
      JWT_COOKIE_NAME,
      claim,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    ctx.state.user = jwt.decode(claim);
    console.log('New user created...');
  }

  await next();
};
