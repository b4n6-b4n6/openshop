import { THUMB_CACHE_KEY } from '../../const.js';
import assertImage from '../../utils/assertImage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbCache } = ctx;
  const { shops } = backend;
  const address = onionSpinner.onion;
  const banner_photo = ctx.request.files.photo?.[0]?.buffer;

  await assertImage(banner_photo);
  await shops.update({ address, banner_photo });
  await thumbCache.clear(THUMB_CACHE_KEY.BANNER);

  ctx.redirectWith303('/shop/settings');
};
