import createUserClaim from '../utils/createUserClaim.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';

export default () => async (ctx, next) => {
  const { JWT_COOKIE_NAME } = ctx.constants;

  if (!ctx.cookies.get(JWT_COOKIE_NAME)) {
    ctx.cookies.set(
      JWT_COOKIE_NAME,
      createUserClaim(),
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    console.log('New user created...');
    ctx.redirect(checkOpenShopBrowser(ctx) ? '/browser/' : '/');
  } else {
    await next();
  }
};
