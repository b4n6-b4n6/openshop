import {
  MY_SHOP_BANNER_PHOTO_MAX_DIMENSION,
  MY_SHOP_PROFILE_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import viewShopPage from '../pages/viewShopPage.js';

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

  if (shop.profile_photo) {
    shop.profile_photo = (
      await thumbnailCache.genThumb(
        'profile_photo',
        shop.profile_photo,
        MY_SHOP_PROFILE_PHOTO_MAX_DIMENSION,
      )
    );
  }

  if (shop.banner_photo) {
    shop.banner_photo = (
      await thumbnailCache.genThumb(
        'banner_photo',
        shop.banner_photo,
        MY_SHOP_BANNER_PHOTO_MAX_DIMENSION,
      )
    );
  }

  ctx.body = viewShopPage(shop);
};
