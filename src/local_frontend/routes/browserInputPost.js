/* eslint-disable camelcase */
import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import IsValidOnionHostname from '../utils/IsValidOnionHostname.js';
import browserErrorPage from '../pages/browserErrorPage.js';

export default async (ctx) => {
  const { request } = ctx;
  const { browsed_onion_address } = request.body;
  console.log(request.body);

  if (IsValidOnionHostname(browsed_onion_address)) {
    ctx.cookies.set(
      BROWSED_ONION_COOKIE_NAME,
      browsed_onion_address,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    ctx.redirect('/browser/');
  } else {
    ctx.status = 500;
    ctx.body = browserErrorPage({ message: 'invalid address format' });
  }
};
