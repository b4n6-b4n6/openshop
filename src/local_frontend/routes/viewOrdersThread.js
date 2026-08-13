import {
  CACHE_CONTROL_LIVE,
  THUMB_CACHE_SIZE,
  THUMB_CACHE_KEY,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';
import viewOrdersThreadPage from '../pages/viewOrdersThreadPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { orders } = backend;

  const allOrders = (
    await Promise.all(
      (await orders.getAllForShop()).map(async (order) => ({
        ...order,
        product_photo: await bufferToImageDataURI(
          order.product_photo_exists
            ? await thumbnailCache.genThumb(
              `${THUMB_CACHE_KEY.ORDER}:${order.id}`,
              () => orders.getPhoto(order.id),
              THUMB_CACHE_SIZE.ORDER,
            )
            : null,
        ),
      })),
    )
  );

  const version = ordersVersion(allOrders);
  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  ctx.body = viewOrdersThreadPage({ allOrders });
};
