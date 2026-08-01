import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import {
  MY_SHOP_BANNER_PHOTO_MAX_DIMENSION,
  MY_SHOP_PROFILE_PHOTO_MAX_DIMENSION,
} from '../../const.js';

export default async (ctx) => {
  const { myOnion, backend, thumbnailCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);

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

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
  });
};
