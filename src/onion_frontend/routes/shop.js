import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import { THUMB_CACHE_SIZE, THUMB_CACHE_KEY } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import genQr from '../../utils/genQr.js';

export default async (ctx) => {
  const { myOnion, backend, thumbCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);
  if (!shop) ctx.throw(404, 'Shop not found');

  const [profilePhoto, bannerPhoto] = (await Promise.all([
    shop.profile_photo_exists
      ? thumbCache.genThumb(
        THUMB_CACHE_KEY.PROFILE,
        () => shops.getProfilePhoto(myOnion),
        THUMB_CACHE_SIZE.PROFILE,
      )
      : null,
    shop.banner_photo_exists
      ? thumbCache.genThumb(
        THUMB_CACHE_KEY.BANNER,
        () => shops.getBannerPhoto(myOnion),
        THUMB_CACHE_SIZE.BANNER,
      )
      : null,
  ])).map(bufferToImageDataURI);

  const qr = await genQr(myOnion);

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
    qr,
  });
};
