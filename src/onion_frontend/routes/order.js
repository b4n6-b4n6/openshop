import QRCode from 'qrcode';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import { orderVersion } from '../../shared/utils/viewVersions.js';
import orderPage from '../pages/orderPage.js';
import { MY_SHOP_PRODUCT_THUMB_SIZE, CACHE_CONTROL_DIRECTIVE } from '../../const.js';

export default async (ctx) => {
  const {
    params, backend, state, thumbnailCache,
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
  ctx.set('Cache-Control', CACHE_CONTROL_DIRECTIVE);

  const amount = picoToXmr(order.deposit_amount);

  const [qr, productPhoto] = await Promise.all([
    QRCode.toDataURL(
      createInvoiceUri({ depositAddress, amount }),
      {
        color: { dark: '#0f1115', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 240,
      },
    ),
    bufferToImageDataURI(
      order.product_photo_exists
        ? await thumbnailCache.genThumb(
          `order:${order.id}`,
          () => orders.getPhoto(order.id),
          MY_SHOP_PRODUCT_THUMB_SIZE,
        )
        : null,
    ),
  ]);

  ctx.body = orderPage({
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
