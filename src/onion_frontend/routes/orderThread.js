import genQr from '../../utils/genQr.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import { orderVersion } from '../../shared/utils/viewVersions.js';
import {
  CACHE_CONTROL_LIVE,
  THUMB_CACHE_SIZE,
  THUMB_CACHE_KEY,
} from '../../const.js';
import orderThreadPage from '../pages/orderThreadPage.js';

export default async (ctx) => {
  const {
    params, backend, state, thumbCache,
  } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order || order.customer !== state.user.userId) {
    ctx.throw(404, 'Order not found');
  }

  const depositAddress = ctx.walletHandler.address;
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
      ? await thumbCache.genThumb(
        `${THUMB_CACHE_KEY.ORDER}:${order.id}`,
        () => orders.getPhoto(order.id),
        THUMB_CACHE_SIZE.ORDER,
      )
      : null,
  );

  ctx.body = orderThreadPage({
    order: {
      ...order,
      product_photo: productPhoto,
      id,
    },
    depositAddress,
    qr,
    version,
  });
};
