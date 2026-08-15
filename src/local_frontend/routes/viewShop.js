import {
  THUMB_CACHE_KEY,
  THUMB_CACHE_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import genQr from '../../utils/genQr.js';
import viewShopPage from '../pages/viewShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  const shop = await shops.getOrCreate(address);

  const [profilePhoto, bannerPhoto] = (await Promise.all([
    shop.profile_photo_exists
      ? thumbCache.genThumb(
        THUMB_CACHE_KEY.PROFILE,
        () => shops.getProfilePhoto(address),
        THUMB_CACHE_SIZE.PROFILE,
      )
      : null,
    shop.banner_photo_exists
      ? thumbCache.genThumb(
        THUMB_CACHE_KEY.BANNER,
        () => shops.getBannerPhoto(address),
        THUMB_CACHE_SIZE.BANNER,
      )
      : null,
  ])).map(bufferToImageDataURI);

  const qr = await genQr(address);

  ctx.body = viewShopPage({
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
    qr,
  });
};
