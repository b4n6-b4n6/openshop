import IsValidOnion from '../utils/IsValidOnion.js';
import browserErrorPage from '../pages/browserErrorPage.js';

export default async (ctx) => {
  const { session, request } = ctx;
  const { onion } = request.body;

  if (IsValidOnion(onion)) {
    session.onion = onion;

    ctx.redirect('/browser/');
  } else {
    ctx.status = 500;
    ctx.body = browserErrorPage();
  }
};
