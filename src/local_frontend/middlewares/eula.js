import { eulaPage } from '../../shared/pages/eulaPage.js';

const KEY_COOKIE_NAME = 'eulapass';

export default () => async (ctx, next) => {
  const passed = ctx.cookies.get(KEY_COOKIE_NAME);
  if (passed) {
    await next();
    return;
  }

  if (ctx.path === '/eula') {
    if (ctx.method === 'POST') {
      ctx.cookies.set(
        KEY_COOKIE_NAME,
        '1',
        { expires: new Date('9999-12-31T23:59:59.999Z') },
      );
      ctx.redirect('/');
    } else {
      ctx.body = eulaPage();
    }
  } else {
    ctx.redirect('/eula');
  }
};
