import genQr from '../../utils/genQr.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import { orderVersion } from '../../shared/utils/viewVersions.js';
import viewOrderThreadPage from '../pages/viewOrderThreadPage.js';
import {
  CACHE_CONTROL_LIVE,
  THUMB_CACHE_SIZE,
  THUMB_CACHE_KEY,
} from '../../const.js';

export default async (ctx) => {
  const { params, backend, thumbnailCache } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order) ctx.throw(404, 'Order not found');

  const depositAddress = ctx.walletSetup.address;
  if (!depositAddress) ctx.throw(503, 'Payment address unavailable');

  const version = orderVersion(order);
  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  const amount = picoToXmr(order.deposit_amount);
  const qr = await genQr(createInvoiceUri({ depositAddress, amount }));

  const productPhoto = bufferToImageDataURI(
    order.product_photo_exists
      ? await thumbnailCache.genThumb(
        `${THUMB_CACHE_KEY.ORDER}:${order.id}`,
        () => orders.getPhoto(order.id),
        THUMB_CACHE_SIZE.ORDER,
      )
      : null,
  );

  ctx.body = viewOrderThreadPage({
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
