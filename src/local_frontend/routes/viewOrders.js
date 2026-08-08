import {
  MY_SHOP_PRODUCT_THUMB_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import viewOrdersPage from '../pages/viewOrdersPage.js';

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
              `order:${order.id}`,
              () => orders.getPhoto(order.id),
              MY_SHOP_PRODUCT_THUMB_SIZE,
            )
            : null,
        ),
      })),
    )
  );

  ctx.body = viewOrdersPage({ allOrders });
};
