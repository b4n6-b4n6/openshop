import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import IsValidOnionHostname from '../utils/IsValidOnionHostname.js';
import trimOnionHostname from '../utils/trimOnionHostname.js';
import browserErrorPage from '../pages/browserErrorPage.js';

export default async (ctx) => {
  const { request } = ctx;
  const browsed_onion_address = trimOnionHostname(request.body.browsed_onion_address);

  if (IsValidOnionHostname(browsed_onion_address)) {
    ctx.cookies.set(
      BROWSED_ONION_COOKIE_NAME,
      browsed_onion_address,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );

    ctx.redirect('/browser/');
  } else {
    ctx.body = browserErrorPage({ message: '' });
  }
};
