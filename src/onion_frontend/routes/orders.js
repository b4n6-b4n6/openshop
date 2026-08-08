import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import ordersPage from '../pages/ordersPage.js';

export default async (ctx) => {
  const { backend, state, thumbnailCache } = ctx;
  const { orders } = backend;
  const { userId } = state.user;

  const allOrders = (
    await Promise.all(
      (await orders.getAllForCustomer(userId)).map(async (order) => ({
        ...order,
        product_photo: (
          order.product_photo_exists
            ? await thumbnailCache.genThumb(
              `order:${order.id}`,
              () => orders.getPhoto(order.id),
              MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
            )
            : null
        ),
      })),
    )
  );

  ctx.body = ordersPage({ allOrders });
};
