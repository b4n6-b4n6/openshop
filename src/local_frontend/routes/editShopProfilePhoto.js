import { THUMB_CACHE_KEY } from '../../const.js';
import assertImage from '../../utils/assertImage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbCache } = ctx;
  const { shops } = backend;
  const address = onionSpinner.onion;
  const profile_photo = ctx.request.files.photo?.[0]?.buffer;

  await assertImage(profile_photo);
  await shops.update({ address, profile_photo });
  await thumbCache.clear(THUMB_CACHE_KEY.PROFILE);

  ctx.redirectWith303('/shop/settings');
};
