import {
  CACHE_CONTROL_LIVE,
  THUMB_CACHE_SIZE,
  ORDERS_PAGE_REFRESH,
  THUMB_CACHE_KEY,
} from '../../const.js';
import { ordersThreadPage } from '../../shared/pages/ordersPage.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

export default async (ctx) => {
  const { backend, state, thumbnailCache } = ctx;
  const { orders } = backend;
  const { userId } = state.user;

  const allOrders = (
    await Promise.all(
      (await orders.getAllForCustomer(userId)).map(async (order) => ({
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

  ctx.body = ordersThreadPage({
    allOrders,
    refresh: ORDERS_PAGE_REFRESH,
  });
};
