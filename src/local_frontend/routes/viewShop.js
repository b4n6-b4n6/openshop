import QRCode from 'qrcode';
import {
  THUMB_CACHE_KEY,
  THUMB_CACHE_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import viewShopPage from '../pages/viewShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbnailCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  const shop = await shops.getOrCreate(address);

  const profilePhoto = bufferToImageDataURI(
    shop.profile_photo_exists
      ? (
        await thumbnailCache.genThumb(
          THUMB_CACHE_KEY.PROFILE,
          () => shops.getProfilePhoto(address),
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
          () => shops.getBannerPhoto(address),
          THUMB_CACHE_SIZE.BANNER,
        )
      )
      : null,
  );

  const qr = await QRCode.toDataURL(address, {
    color: { dark: '#0f1115', light: '#ffffff' },
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 240,
  });

  ctx.body = viewShopPage({
    ...shop,
    profile_photo: profilePhoto,
    banner_photo: bannerPhoto,
    qr,
  });
};
