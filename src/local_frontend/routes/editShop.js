import { THUMB_CACHE_SIZE, THUMB_CACHE_KEY } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import editShopPage from '../pages/editShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbnailCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  const shop = await shops.getOrCreate(address);

  const [profilePhoto, bannerPhoto] = (await Promise.all([
    shop.profile_photo_exists
      ? thumbnailCache.genThumb(
        THUMB_CACHE_KEY.PROFILE,
        () => shops.getProfilePhoto(address),
        THUMB_CACHE_SIZE.PROFILE,
      )
      : null,
    shop.banner_photo_exists
      ? thumbnailCache.genThumb(
        THUMB_CACHE_KEY.BANNER,
        () => shops.getBannerPhoto(address),
        THUMB_CACHE_SIZE.BANNER,
      )
      : null,
  ])).map(bufferToImageDataURI);

  ctx.body = editShopPage({
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
  });
};
