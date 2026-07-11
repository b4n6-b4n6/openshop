import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import IsValidOnion from '../utils/IsValidOnion.js';
import browserErrorPage from '../pages/browserErrorPage.js';

export default async (ctx) => {
  const { request } = ctx;
  const { onion } = request.body;

  if (IsValidOnion(onion)) {
    ctx.cookies.set(
      BROWSED_ONION_COOKIE_NAME,
      onion,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    ctx.redirect('/browser/');
  } else {
    ctx.status = 500;
    ctx.body = browserErrorPage({ message: 'invalid address format' });
  }
};
