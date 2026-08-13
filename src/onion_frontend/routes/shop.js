import QRCode from 'qrcode';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import { THUMB_CACHE_SIZE, THUMB_CACHE_KEY } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

export default async (ctx) => {
  const { myOnion, backend, thumbnailCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);
  if (!shop) ctx.throw(404, 'Shop not found');

  const profilePhoto = bufferToImageDataURI(
    shop.profile_photo_exists
      ? (
        await thumbnailCache.genThumb(
          THUMB_CACHE_KEY.PROFILE,
          () => shops.getProfilePhoto(myOnion),
          THUMB_CACHE_SIZE.PROFILE,
        )
      )
      : null,
  );

  const bannerPhoto = bufferToImageDataURI(
    shop.banner_photo_exists
      ? (
        await thumbnailCache.genThumb(
          THUMB_CACHE_KEY.BANNER,
          () => shops.getBannerPhoto(myOnion),
          THUMB_CACHE_SIZE.BANNER,
        )
      )
      : null,
  );

  const qr = await QRCode.toDataURL(myOnion, {
    color: { dark: '#0f1115', light: '#ffffff' },
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 240,
  });

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
    qr,
  });
};
