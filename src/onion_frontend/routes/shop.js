import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import {
  MY_SHOP_BANNER_PHOTO_SIZE,
  MY_SHOP_PROFILE_PHOTO_SIZE,
} from '../../const.js';

export default async (ctx) => {
  const { myOnion, backend, thumbnailCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);

  shop.profile_photo = (
    shop.profile_photo_exists
      ? (
        await thumbnailCache.genThumb(
          'profile_photo',
          () => shops.getProfilePhoto(myOnion),
          MY_SHOP_PROFILE_PHOTO_SIZE,
        )
      )
      : null
  );

  shop.banner_photo = (
    shop.banner_photo_exists
      ? (
        await thumbnailCache.genThumb(
          'banner_photo',
          () => shops.getBannerPhoto(myOnion),
          MY_SHOP_BANNER_PHOTO_SIZE,
        )
      )
      : null
  );

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
  });
};
