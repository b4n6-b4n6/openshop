import QRCode from 'qrcode';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import { orderVersion } from '../../shared/utils/viewVersions.js';
import viewOrderPage from '../pages/viewOrderPage.js';
import { MY_SHOP_PRODUCT_THUMB_SIZE } from '../../const.js';

export default async (ctx) => {
  const { params, backend, thumbnailCache } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order) ctx.throw(404, 'Order not found');

  const depositAddress = ctx.walletSetup.address;
  if (!depositAddress) ctx.throw(503, 'Payment address unavailable');

  const version = orderVersion(order);
  ctx.set('Cache-Control', 'no-store');
  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }

  const amount = (Number(order.deposit_amount) / 1e12).toFixed(12);
  const qr = await QRCode.toDataURL(
    `monero:${depositAddress}?tx_amount=${amount}`,
    {
      color: { dark: '#0f1115', light: '#ffffff' },
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 240,
    },
  );

  const productPhoto = (
    await bufferToImageDataURI(
      order.product_photo_exists
        ? await thumbnailCache.genThumb(
          `order:${order.id}`,
          () => orders.getPhoto(order.id),
          MY_SHOP_PRODUCT_THUMB_SIZE,
        )
        : null,
    )
  );

  ctx.body = viewOrderPage({
    order: {
      ...order,
      id,
      product_photo: productPhoto,
    },
    depositAddress,
    qr,
    version,
  });
};
