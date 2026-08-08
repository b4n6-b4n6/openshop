import {
  MY_SHOP_BANNER_PHOTO_SIZE,
  MY_SHOP_PROFILE_PHOTO_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import editShopPage from '../pages/editShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbnailCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  const shop = await shops.getOrCreate(address);

  const [profilePhoto, bannerPhoto] = await Promise.all([
    shop.profile_photo_exists
      ? thumbnailCache.genThumb(
        'profile_photo',
        () => shops.getProfilePhoto(address),
        MY_SHOP_PROFILE_PHOTO_SIZE,
      )
      : null,
    shop.banner_photo_exists
      ? thumbnailCache.genThumb(
        'banner_photo',
        () => shops.getBannerPhoto(address),
        MY_SHOP_BANNER_PHOTO_SIZE,
      )
      : null,
  ]);

  ctx.body = editShopPage({
    ...shop,
    profile_photo: await bufferToImageDataURI(profilePhoto),
    banner_photo: await bufferToImageDataURI(bannerPhoto),
  });
};
