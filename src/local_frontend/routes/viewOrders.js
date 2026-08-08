import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import viewOrdersPage from '../pages/viewOrdersPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { orders } = backend;

  const allOrders = (
    await Promise.all(
      (await orders.getAllForShop()).map(async (order) => ({
        ...order,
        product_photo: (
          order.product_photo_exists
            ? await thumbnailCache.genThumb(
              `order:${order.id}`,
              () => orders.getProductPhoto(order.id),
              MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
            )
            : null
        ),
      })),
    )
  );

  ctx.body = viewOrdersPage({ allOrders });
};
