import {
  MY_SHOP_BANNER_PHOTO_MAX_DIMENSION,
  MY_SHOP_PROFILE_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import editShopPage from '../pages/editShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbnailCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  let shop = await shops.get(address);
  if (!shop) {
    shop = {
      address,
      name: '',
      description: '',
      profile_photo: null,
      banner_photo: null,
    };
    await shops.update(shop);
  }

  const [profilePhoto, bannerPhoto] = await Promise.all([
    shop.profile_photo
      ? thumbnailCache.genThumb(
        'profile_photo',
        shop.profile_photo,
        MY_SHOP_PROFILE_PHOTO_MAX_DIMENSION,
      )
      : null,
    shop.banner_photo
      ? thumbnailCache.genThumb(
        'banner_photo',
        shop.banner_photo,
        MY_SHOP_BANNER_PHOTO_MAX_DIMENSION,
      )
      : null,
  ]);

  ctx.body = editShopPage({
    ...shop,
    profile_photo: await bufferToImageDataURI(profilePhoto),
    banner_photo: await bufferToImageDataURI(bannerPhoto),
  });
};
