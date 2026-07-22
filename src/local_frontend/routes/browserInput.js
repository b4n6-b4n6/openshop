import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import browserInputPage from '../pages/browserInputPage.js';

export default async (ctx) => {
  const browsedOnion = ctx.cookies.get(BROWSED_ONION_COOKIE_NAME);

  ctx.body = browserInputPage({
    defaultOnionHostname: browsedOnion ?? '',
  });
};
