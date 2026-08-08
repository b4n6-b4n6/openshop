import QRCode from 'qrcode';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import {
  MY_SHOP_BANNER_PHOTO_SIZE,
  MY_SHOP_PROFILE_PHOTO_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

export default async (ctx) => {
  const { myOnion, backend, thumbnailCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);
  if (!shop) ctx.throw(404, 'Shop not found');

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

  const [profilePhoto, bannerPhoto, qr] = await Promise.all([
    bufferToImageDataURI(shop.profile_photo),
    bufferToImageDataURI(shop.banner_photo),
    QRCode.toDataURL(myOnion, {
      color: { dark: '#0f1115', light: '#ffffff' },
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 240,
    }),
  ]);

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
    qr,
  });
};
