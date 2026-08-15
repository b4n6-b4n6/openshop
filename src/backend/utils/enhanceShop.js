import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import { THUMB_CACHE_SIZE, THUMB_CACHE_KEY } from '../../const.js';

export default async ({
  shop, thumbCache, shops, address,
}) => ({
  ...shop,
  profile_photo: bufferToImageDataURI(
    shop.profile_photo_exists
      ? await thumbCache.genThumb(
        THUMB_CACHE_KEY.PROFILE,
        () => shops.getProfilePhoto(address),
        THUMB_CACHE_SIZE.PROFILE,
      )
      : null,
  ),
  banner_photo: bufferToImageDataURI(
    shop.banner_photo_exists
      ? await thumbCache.genThumb(
        THUMB_CACHE_KEY.BANNER,
        () => shops.getBannerPhoto(address),
        THUMB_CACHE_SIZE.BANNER,
      )
      : null,
  ),
});

// TODO parallelise
