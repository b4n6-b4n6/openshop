import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import IsValidOnionHostname from '../utils/IsValidOnionHostname.js';
import trimOnionHostname from '../utils/trimOnionHostname.js';

export default async (ctx) => {
  const { request } = ctx;
  const { name, description } = request.body;

  const { onionSpinner, backend } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  await shops.update({ address, name, description });

  ctx.redirect('/shop');
};
